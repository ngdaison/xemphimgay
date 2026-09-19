import { Controller, Get, Post, Param, UseGuards, Request } from '@nestjs/common';
import { StoryService } from './story.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('stories')
@Controller('stories')
export class StoryController {
  constructor(private storyService: StoryService) {}

  @Get('chapter/:id')
  @ApiOperation({ summary: 'Get story chapter by ID' })
  async getChapter(@Param('id') id: string) {
    return this.storyService.getChapter(id);
  }

  @Post('chapter/:id/progress')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Save reading progress for a chapter' })
  async saveProgress(@Param('id') id: string, @Request() req: any) {
    return this.storyService.saveProgress(req.user.id, id);
  }
}
