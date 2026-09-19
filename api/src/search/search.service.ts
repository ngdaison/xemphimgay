import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ContentStatus } from '@webtruyenphim/database';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async searchContent(query: string, type?: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    
    // Basic search using Prisma's contains
    // In production with 100k CCU, this should be optimized with PostgreSQL Full-Text Search
    // or an external engine like Meilisearch/Elasticsearch (though requirements say self-host only)
    const [items, total] = await Promise.all([
      this.prisma.content.findMany({
        where: {
          status: ContentStatus.PUBLISHED,
          type: type as any,
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { originalTitle: { contains: query, mode: 'insensitive' } },
            { otherTitles: { has: query } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        skip,
        take: limit,
        orderBy: { viewCount: 'desc' },
      }),
      this.prisma.content.count({
        where: {
          status: ContentStatus.PUBLISHED,
          type: type as any,
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { originalTitle: { contains: query, mode: 'insensitive' } },
            { otherTitles: { has: query } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
      }),
    ]);

    // Log search
    await this.prisma.searchLog.create({
      data: {
        query,
        resultCount: total,
      },
    }).catch((err: any) => {
      console.error('Failed to log search query:', err?.message);
    }); // Don't block if logging fails

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getSuggestions(query: string) {
    return this.prisma.content.findMany({
      where: {
        status: ContentStatus.PUBLISHED,
        title: { contains: query, mode: 'insensitive' },
      },
      take: 5,
      select: {
        id: true,
        title: true,
        slug: true,
        type: true,
        posterUrl: true,
      },
    });
  }
}
