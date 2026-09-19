import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    @InjectQueue('transcode') private transcodeQueue: Queue,
  ) {}

  async getDashboardStats() {
    const [userCount, contentCount, viewCount] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.content.count(),
      this.prisma.content.aggregate({ _sum: { viewCount: true } }),
    ]);

    const recentContents = await this.prisma.content.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { genres: { include: { genre: true } } },
    });

    return {
      stats: {
        totalUsers: userCount,
        totalContents: contentCount,
        totalViews: viewCount._sum.viewCount || 0,
      },
      recentContents,
    };
  }

  async triggerTranscode(episodeId: string, filePath: string) {
    const job = await this.transcodeQueue.add('transcode-video', {
      episodeId,
      filePath,
    });

    return {
      jobId: job.id,
      message: 'Transcoding job queued successfully',
    };
  }

  async listAllContents() {
    return this.prisma.content.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        genres: { include: { genre: true } },
      },
    });
  }

  async createContent(data: any) {
    const { genres, ...contentData } = data;
    return this.prisma.content.create({
      data: {
        ...contentData,
        genres: genres ? {
          create: genres.map((genreId: string) => ({
            genre: { connect: { id: genreId } }
          }))
        } : undefined
      },
    });
  }

  async getContentById(id: string) {
    return this.prisma.content.findUnique({
      where: { id },
      include: {
        anime: { include: { episodes: { include: { sources: true } } } },
        video: { include: { episodes: { include: { sources: true } } } },
        story: { include: { chapters: true } },
        manga: { include: { chapters: { include: { pages: true } } } },
        genres: { include: { genre: true } },
      }
    });
  }

  async addEpisode(contentId: string, data: any) {
    const content = await this.prisma.content.findUnique({ where: { id: contentId }, include: { anime: true, video: true } });
    if (!content) throw new Error('Content not found');

    const episodeData = {
      ...data,
      animeId: content.type === 'ANIME' ? contentId : undefined,
      videoId: content.type === 'VIDEO' || content.type === 'MOVIE' ? contentId : undefined,
    };

    return this.prisma.videoEpisode.create({
      data: episodeData
    });
  }

  async addChapter(contentId: string, data: any) {
    const content = await this.prisma.content.findUnique({ where: { id: contentId }, include: { story: true, manga: true } });
    if (!content) throw new Error('Content not found');

    if (content.type === 'STORY') {
      return this.prisma.storyChapter.create({
        data: { ...data, storyId: contentId }
      });
    } else if (content.type === 'MANGA') {
      const { pages, ...chapterData } = data;
      return this.prisma.mangaChapter.create({
        data: {
          ...chapterData,
          mangaId: contentId,
          pages: pages ? { create: pages } : undefined
        }
      });
    }
  }

  async deleteContent(id: string) {
    const content = await this.prisma.content.findUnique({ where: { id } });
    if (!content) throw new Error('Content not found');

    // Delete in order to respect foreign key constraints
    if (content.type === 'ANIME') {
      await this.prisma.videoSource.deleteMany({ where: { episode: { animeId: id } } });
      await this.prisma.videoEpisode.deleteMany({ where: { animeId: id } });
      await this.prisma.anime.delete({ where: { contentId: id } });
    } else if (content.type === 'VIDEO' || content.type === 'MOVIE') {
      await this.prisma.videoSource.deleteMany({ where: { episode: { videoId: id } } });
      await this.prisma.videoEpisode.deleteMany({ where: { videoId: id } });
      await this.prisma.video.delete({ where: { contentId: id } }).catch(() => {});
    } else if (content.type === 'MANGA') {
      await this.prisma.mangaPage.deleteMany({ where: { chapter: { mangaId: id } } });
      await this.prisma.mangaChapter.deleteMany({ where: { mangaId: id } });
      await this.prisma.manga.delete({ where: { contentId: id } });
    } else if (content.type === 'STORY') {
      await this.prisma.storyChapter.deleteMany({ where: { storyId: id } });
      await this.prisma.story.delete({ where: { contentId: id } });
    }

    return this.prisma.content.delete({ where: { id } });
  }
}
