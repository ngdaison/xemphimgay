import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { MediaService } from '../media/media.service';

@Injectable()
export class VideoService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private mediaService: MediaService,
  ) {}

  async getEpisode(episodeId: string) {
    // 1. Try to find as a VideoEpisode first
    let episode = await this.prisma.videoEpisode.findUnique({
      where: { id: episodeId },
      include: {
        sources: true,
        anime: {
          include: {
            content: {
              include: {
                genres: { include: { genre: true } },
              },
            },
            episodes: {
              orderBy: { episodeNum: 'asc' },
              select: { id: true, episodeNum: true, title: true, thumbnailUrl: true },
            },
          },
        },
        video: {
          include: {
            content: {
              include: {
                genres: { include: { genre: true } },
              },
            },
            episodes: {
              orderBy: { episodeNum: 'asc' },
              select: { id: true, episodeNum: true, title: true, thumbnailUrl: true },
            },
          },
        },
      },
    });

    if (episode) {
      // Apply signed URLs to all video sources
      if (episode.sources?.length > 0) {
        episode.sources = episode.sources.map(source => ({
          ...source,
          url: this.mediaService.getSignedUrl(source.url),
          manifestUrl: source.manifestUrl ? this.mediaService.getSignedUrl(source.manifestUrl) : null,
        }));
      }

      // Flatten content to top-level for frontend convenience
      const content = episode.anime?.content || episode.video?.content || null;

      return {
        ...episode,
        content,
      };
    }

    // 2. If not found, check if it's a Movie ID (direct movie watch)
    const movie = await this.prisma.movie.findUnique({
      where: { contentId: episodeId },
      include: {
        content: {
          include: {
            genres: { include: { genre: true } },
          },
        },
      },
    });

    if (movie) {
      // Find video sources for this movie. Since Movie relation doesn't have direct episodes in the schema but uses videoSourceId,
      // or we can query any VideoSource records associated. Let's see if there are VideoSource records.
      // Alternatively, let's query VideoSource directly matching the contentId or a mock source if none exists.
      const sources = await this.prisma.videoSource.findMany({
        where: { episodeId: movie.contentId }
      });

      // Apply signed URLs
      const signedSources = sources.map(source => ({
        ...source,
        url: this.mediaService.getSignedUrl(source.url),
        manifestUrl: source.manifestUrl ? this.mediaService.getSignedUrl(source.manifestUrl) : null,
      }));

      // Return a unified Virtual Episode structure
      return {
        id: movie.contentId,
        animeId: null,
        videoId: null,
        episodeNum: 1,
        title: movie.content.title,
        description: movie.content.description,
        thumbnailUrl: movie.content.thumbnailUrl || movie.content.posterUrl,
        duration: movie.duration,
        sources: signedSources.length > 0 ? signedSources : [
          {
            id: 'default-movie-source',
            episodeId: movie.contentId,
            quality: '1080p',
            url: this.mediaService.getSignedUrl('https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'),
            manifestUrl: this.mediaService.getSignedUrl('https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'),
            bitrate: null,
            codec: null,
            createdAt: new Date(),
          }
        ],
        content: movie.content,
      };
    }

    throw new NotFoundException('Episode or Movie not found');
  }

  async saveProgress(userId: string, episodeId: string, progress: number) {
    return this.prisma.watchHistory.upsert({
      where: {
        userId_episodeId: {
          userId,
          episodeId,
        },
      },
      update: { progress, updatedAt: new Date() },
      create: {
        userId,
        episodeId,
        progress,
      },
    });
  }
}
