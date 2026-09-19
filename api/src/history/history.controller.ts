import { Controller, Get, Post, Body, Query, UseGuards, Req } from '@nestjs/common';
import { HistoryService } from './history.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('History')
@Controller('history')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Post('watch')
  @ApiOperation({ summary: 'Update watch progress' })
  async updateWatchProgress(
    @Req() req: any,
    @Body() body: { episodeId: string; progress: number },
  ) {
    return this.historyService.updateWatchProgress(req.user.id, body.episodeId, body.progress);
  }

  @Post('read')
  @ApiOperation({ summary: 'Update read progress' })
  async updateReadProgress(
    @Req() req: any,
    @Body() body: { storyChapterId?: string; mangaChapterId?: string; pageNum?: number },
  ) {
    return this.historyService.updateReadProgress(req.user.id, body);
  }

  @Get('watch')
  @ApiOperation({ summary: 'Get watch history' })
  async getWatchHistory(@Req() req: any, @Query('page') page?: number, @Query('limit') limit?: number) {
    return this.historyService.getWatchHistory(req.user.id, page, limit);
  }

  @Get('read')
  @ApiOperation({ summary: 'Get read history' })
  async getReadHistory(@Req() req: any, @Query('page') page?: number, @Query('limit') limit?: number) {
    return this.historyService.getReadHistory(req.user.id, page, limit);
  }
}
