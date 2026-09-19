import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HistoryService {
  constructor(private prisma: PrismaService) {}

  async updateWatchProgress(userId: string, episodeId: string, progress: number) {
    return this.prisma.watchHistory.upsert({
      where: {
        userId_episodeId: {
          userId,
          episodeId,
        },
      },
      update: { progress },
      create: {
        userId,
        episodeId,
        progress,
      },
    });
  }

  async updateReadProgress(userId: string, { storyChapterId, mangaChapterId, pageNum }: { storyChapterId?: string; mangaChapterId?: string; pageNum?: number }) {
    return this.prisma.readHistory.upsert({
      where: {
        userId_storyChapterId_mangaChapterId: {
          userId,
          storyChapterId: (storyChapterId || '') as string,
          mangaChapterId: (mangaChapterId || '') as string,
        },
      },
      update: { pageNum },
      create: {
        userId,
        storyChapterId,
        mangaChapterId,
        pageNum,
      },
    });
  }

  async getWatchHistory(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    return this.prisma.watchHistory.findMany({
      where: { userId },
      skip,
      take: limit,
      orderBy: { updatedAt: 'desc' },
      include: {
        episode: {
          include: {
            anime: { include: { content: true } },
            video: { include: { content: true } },
          },
        },
      },
    });
  }

  async getReadHistory(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    return this.prisma.readHistory.findMany({
      where: { userId },
      skip,
      take: limit,
      orderBy: { updatedAt: 'desc' },
      include: {
        storyChapter: { include: { story: { include: { content: true } } } },
        mangaChapter: { include: { manga: { include: { content: true } } } },
      },
    });
  }
}
