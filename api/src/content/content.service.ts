import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ContentType, ContentStatus } from '@webtruyenphim/database';

@Injectable()
export class ContentService {
  constructor(private prisma: PrismaService) {}

  async getHomeContent() {
    const [featured, trending, newUpdates, newMovies, newManga, newStories] = await Promise.all([
      this.prisma.content.findMany({
        where: { status: ContentStatus.PUBLISHED },
        take: 10,
        orderBy: { viewCount: 'desc' },
        include: { genres: { include: { genre: true } } },
      }),
      this.prisma.content.findMany({
        where: { status: ContentStatus.PUBLISHED },
        take: 15,
        orderBy: { viewCount: 'desc' },
        include: { genres: { include: { genre: true } } },
      }),
      this.prisma.content.findMany({
        where: { status: ContentStatus.PUBLISHED },
        take: 15,
        orderBy: { publishedAt: 'desc' },
      }),
      this.prisma.content.findMany({
        where: { status: ContentStatus.PUBLISHED, type: { in: [ContentType.MOVIE, ContentType.ANIME] } },
        take: 15,
        orderBy: { publishedAt: 'desc' },
      }),
      this.prisma.content.findMany({
        where: { status: ContentStatus.PUBLISHED, type: ContentType.MANGA },
        take: 15,
        orderBy: { publishedAt: 'desc' },
      }),
      this.prisma.content.findMany({
        where: { status: ContentStatus.PUBLISHED, type: ContentType.STORY },
        take: 15,
        orderBy: { publishedAt: 'desc' },
      }),
    ]);

    return {
      featured,
      trending,
      newUpdates,
      newMovies,
      newManga,
      newStories,
    };
  }

  async findAll(query: { type?: ContentType; genre?: string; status?: ContentStatus; take?: number; skip?: number }) {
    const { type, genre, status = ContentStatus.PUBLISHED, take = 20, skip = 0 } = query;

    const where: any = {
      status,
    };

    if (type) {
      where.type = type;
    }

    if (genre) {
      where.genres = {
        some: {
          genre: {
            slug: genre,
          },
        },
      };
    }

    const [items, total] = await Promise.all([
      this.prisma.content.findMany({
        where,
        take: Number(take),
        skip: Number(skip),
        orderBy: { publishedAt: 'desc' },
        include: {
          genres: { include: { genre: true } },
        },
      }),
      this.prisma.content.count({ where }),
    ]);

    return {
      success: true,
      data: items,
      meta: {
        total,
        take: Number(take),
        skip: Number(skip),
      },
    };
  }

  async getContentBySlug(slug: string) {
    const content = await this.prisma.content.findUnique({
      where: { slug },
      include: {
        genres: { include: { genre: true } },
        tags: { include: { tag: true } },
        movie: true,
        anime: { include: { episodes: { orderBy: { episodeNum: 'asc' } } } },
        manga: { include: { chapters: { orderBy: { chapterNum: 'asc' } } } },
        story: { include: { chapters: { orderBy: { chapterNum: 'asc' } } } },
        country: true,
      },
    });

    if (!content) {
      throw new NotFoundException('Content not found');
    }

    return content;
  }

  async getDetail(id: string) {
    const content = await this.prisma.content.findUnique({
      where: { id },
      include: {
        genres: { include: { genre: true } },
      },
    });

    if (!content) {
      throw new NotFoundException('Content not found');
    }

    return content;
  }

  async getRelatedContent(id: string, type: ContentType, genreIds: string[]) {
    return this.prisma.content.findMany({
      where: {
        id: { not: id },
        type,
        genres: {
          some: {
            genreId: { in: genreIds },
          },
        },
        status: ContentStatus.PUBLISHED,
      },
      take: 6,
      orderBy: { viewCount: 'desc' },
      include: { genres: { include: { genre: true } } },
    });
  }
}
