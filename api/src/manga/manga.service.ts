import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MangaService {
  constructor(private prisma: PrismaService) {}

  async getChapter(chapterId: string) {
    const chapter = await this.prisma.mangaChapter.findUnique({
      where: { id: chapterId },
      include: {
        pages: { orderBy: { pageNum: 'asc' } },
        manga: {
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
}
