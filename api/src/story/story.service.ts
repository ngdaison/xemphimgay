import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StoryService {
  constructor(private prisma: PrismaService) {}

  async getChapter(chapterId: string) {
    const chapter = await this.prisma.storyChapter.findUnique({
      where: { id: chapterId },
      include: {
        story: {
          include: {
            content: true,
            chapters: {
              orderBy: { chapterNum: 'asc' },
              select: { id: true, chapterNum: true, title: true },
            },
          },
        },
      },
    });

    if (!chapter) {
      throw new NotFoundException('Chapter not found');
    }

    return chapter;
  }

  async saveProgress(userId: string, chapterId: string) {
    return (this.prisma.readHistory.upsert as any)({
      where: {
        userId_storyChapterId_mangaChapterId: {
          userId,
          storyChapterId: chapterId,
          mangaChapterId: null,
        },
      },
      update: { updatedAt: new Date() },
      create: {
        userId,
        storyChapterId: chapterId,
      },
    });
  }
}
