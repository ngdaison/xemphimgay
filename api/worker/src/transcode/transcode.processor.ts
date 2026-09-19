import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import ffmpeg from 'fluent-ffmpeg';
import { Logger } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { PrismaService } from '../prisma/prisma.service';

@Processor('transcode')
export class TranscodeProcessor extends WorkerHost {
  private readonly logger = new Logger(TranscodeProcessor.name);

  constructor(private prisma: PrismaService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { episodeId, filePath } = job.data;
    this.logger.log(`Processing transcode for episode: ${episodeId}`);

    const absoluteInputPath = path.resolve(filePath);
    if (!fs.existsSync(absoluteInputPath)) {
      this.logger.error(`Input file not found at: ${absoluteInputPath}`);
      throw new Error(`Input file not found: ${absoluteInputPath}`);
    }

    // Output directory
    const outputDir = path.resolve(__dirname, '../../../../media/videos/hls', episodeId);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const qualities = [
      { name: '360p', resolution: '640x360', bitrate: '800k', maxrate: '850k', bufsize: '1200k' },
      { name: '480p', resolution: '854x480', bitrate: '1400k', maxrate: '1500k', bufsize: '2100k' },
      { name: '720p', resolution: '1280x720', bitrate: '2800k', maxrate: '3000k', bufsize: '4200k' },
      { name: '1080p', resolution: '1920x1080', bitrate: '5000k', maxrate: '5350k', bufsize: '7500k' },
      { name: '1440p', resolution: '2560x1440', bitrate: '9000k', maxrate: '9600k', bufsize: '13500k' },
      { name: '2160p', resolution: '3840x2160', bitrate: '15000k', maxrate: '16000k', bufsize: '22500k' },
    ];

    this.logger.log(`Starting multi-quality HLS transcoding to: ${outputDir}`);

    try {
      // 1. Create a Master Playlist content
      let masterPlaylistContent = '#EXTM3U\n#EXT-X-VERSION:3\n\n';

      for (const q of qualities) {
        const qDir = path.join(outputDir, q.name);
        if (!fs.existsSync(qDir)) fs.mkdirSync(qDir, { recursive: true });

        const playlistPath = path.join(qDir, 'index.m3u8');
        const segmentPattern = path.join(qDir, 'seg_%03d.ts');

        this.logger.log(`Transcoding quality: ${q.name}`);

        await new Promise((resolve, reject) => {
          (ffmpeg(absoluteInputPath) as any)
            .outputOptions([
              `-vf scale=${q.resolution}:force_original_aspect_ratio=decrease`,
              '-c:a aac',
              '-ar 48000',
              '-b:a 128k',
              '-c:v h264',
              '-profile:v main',
              '-crf 20',
              '-g 48',
              '-keyint_min 48',
              '-sc_threshold 0',
              `-b:v ${q.bitrate}`,
              `-maxrate ${q.maxrate}`,
              `-bufsize ${q.bufsize}`,
              '-hls_time 6',
              '-hls_playlist_type vod',
              '-hls_segment_filename', segmentPattern
            ])
            .output(playlistPath)
            .on('progress', (progress: any) => {
              // This progress is for the current quality
              this.logger.debug(`Quality ${q.name} progress: ${progress.percent}%`);
            })
            .on('end', resolve)
            .on('error', reject)
            .run();
        });

        // Add to master playlist
        // Note: Real bandwidth calculation should be more precise
        const bandwidth = parseInt(q.bitrate) * 1000;
        masterPlaylistContent += `#EXT-X-STREAM-INF:BANDWIDTH=${bandwidth},RESOLUTION=${q.resolution}\n${q.name}/index.m3u8\n`;
      }

      // 2. Write Master Playlist
      const masterPath = path.join(outputDir, 'master.m3u8');
      fs.writeFileSync(masterPath, masterPlaylistContent);

      // 3. Update Database
      await this.prisma.videoSource.create({
        data: {
          episodeId,
          quality: 'AUTO',
          url: `/media/videos/hls/${episodeId}/master.m3u8`,
          manifestUrl: `/media/videos/hls/${episodeId}/master.m3u8`,
        }
      });

      this.logger.log(`Multi-quality transcoding COMPLETED for episode: ${episodeId}`);
      return { success: true };

    } catch (error) {
      this.logger.error(`Transcoding failed: ${error.message}`);
      throw error;
    }
  }
}
