import { Controller, Get, Post, Body, Param, Query, UseGuards, Req, Patch } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @ApiOperation({ summary: 'Get my notifications' })
  async getMyNotifications(@Req() req: any, @Query('page') page?: number, @Query('limit') limit?: number) {
    return this.notificationService.getMyNotifications(req.user.id, page, limit);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  async markAsRead(@Req() req: any, @Param('id') id: string) {
    return this.notificationService.markAsRead(id, req.user.id);
  }

  @Post('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  async markAllAsRead(@Req() req: any) {
    return this.notificationService.markAllAsRead(req.user.id);
  }
}
