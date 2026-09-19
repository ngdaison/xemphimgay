import { Controller, Get, Post, Param, Body, UseGuards, Request } from '@nestjs/common';
import { VideoService } from './video.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('videos')
@Controller('videos')
export class VideoController {
  constructor(private videoService: VideoService) {}

  @Get('episode/:id')
  @ApiOperation({ summary: 'Get video episode by ID' })
  async getEpisode(@Param('id') id: string) {
    return this.videoService.getEpisode(id);
  }

  @Post('episode/:id/progress')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Save watch progress for an episode' })
  async saveProgress(
    @Param('id') id: string,
    @Body('progress') progress: number,
    @Request() req: any,
  ) {
    return this.videoService.saveProgress(req.user.id, id, progress);
  }
}
