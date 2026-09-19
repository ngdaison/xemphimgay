import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class NotificationService {
  constructor(
    private prisma: PrismaService,
    @InjectQueue('notifications') private notificationQueue: Queue,
  ) {}

  async createNotification(userId: string, title: string, message: string, type: string) {
    return this.prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
      },
    });
  }

  async sendMassNotification(userIds: string[], title: string, message: string, type: string) {
    await this.notificationQueue.add('mass-notification', {
      userIds,
      title,
      message,
      type,
    });
  }

  async getMyNotifications(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    return this.prisma.notification.findMany({
      where: { userId },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(notificationId: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }
}
