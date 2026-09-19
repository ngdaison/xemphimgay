import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InteractionService {
  constructor(private prisma: PrismaService) {}

  async addComment(userId: string, contentId: string, text: string, parentId?: string) {
    return this.prisma.comment.create({
      data: {
        userId,
        contentId,
        text,
        parentId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
      },
    });
  }

  async getComments(contentId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [comments, total] = await Promise.all([
      this.prisma.comment.findMany({
        where: { contentId, parentId: null, isHidden: false },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true,
            },
          },
          replies: {
            where: { isHidden: false },
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  displayName: true,
                  avatarUrl: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.comment.count({
        where: { contentId, parentId: null, isHidden: false },
      }),
    ]);

    return {
      comments,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async rateContent(userId: string, contentId: string, score: number) {
    // Upsert rating
    const rating = await this.prisma.rating.upsert({
      where: {
        userId_contentId: {
          userId,
          contentId,
        },
      },
      update: { score },
      create: {
        userId,
        contentId,
        score,
      },
    });

    // Recalculate average rating for content
    const aggregate = await this.prisma.rating.aggregate({
      where: { contentId },
      _avg: { score: true },
      _count: { score: true },
    });

    await this.prisma.content.update({
      where: { id: contentId },
      data: {
        ratingAvg: aggregate._avg.score || 0,
        ratingCount: aggregate._count.score || 0,
      },
    });

    return rating;
  }

  async toggleFavorite(userId: string, contentId: string) {
    const existing = await this.prisma.favorite.findUnique({
      where: {
        userId_contentId: { userId, contentId },
      },
    });

    if (existing) {
      await this.prisma.favorite.delete({
        where: {
          userId_contentId: { userId, contentId },
        },
      });
      return { favorited: false };
    } else {
      await this.prisma.favorite.create({
        data: { userId, contentId },
      });
      return { favorited: true };
    }
  }

  async toggleFollow(userId: string, contentId: string) {
    const existing = await this.prisma.follow.findUnique({
      where: {
        userId_contentId: { userId, contentId },
      },
    });

    if (existing) {
      await this.prisma.follow.delete({
        where: {
          userId_contentId: { userId, contentId },
        },
      });
      // Decrement follow count
      await this.prisma.content.update({
        where: { id: contentId },
        data: { followCount: { decrement: 1 } },
      });
      return { followed: false };
    } else {
      await this.prisma.follow.create({
        data: { userId, contentId },
      });
      // Increment follow count
      await this.prisma.content.update({
        where: { id: contentId },
        data: { followCount: { increment: 1 } },
      });
      return { followed: true };
    }
  }

  async reportComment(userId: string, commentId: string, type: string, description: string) {
    return this.prisma.report.create({
      data: {
        userId,
        commentId,
        type,
        description,
      },
    });
  }
}
