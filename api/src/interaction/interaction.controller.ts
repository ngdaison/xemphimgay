import { Controller, Get, Post, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { InteractionService } from './interaction.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Interaction')
@Controller('interaction')
export class InteractionController {
  constructor(private readonly interactionService: InteractionService) {}

  @Get('comments/:contentId')
  @ApiOperation({ summary: 'Get comments for a content' })
  async getComments(
    @Param('contentId') contentId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.interactionService.getComments(contentId, page, limit);
  }

  @Post('comments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a comment' })
  async addComment(
    @Req() req: any,
    @Body() body: { contentId: string; text: string; parentId?: string },
  ) {
    return this.interactionService.addComment(req.user.id, body.contentId, body.text, body.parentId);
  }

  @Post('rate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Rate a content' })
  async rateContent(
    @Req() req: any,
    @Body() body: { contentId: string; score: number },
  ) {
    return this.interactionService.rateContent(req.user.id, body.contentId, body.score);
  }

  @Post('favorite/:contentId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle favorite' })
  async toggleFavorite(@Req() req: any, @Param('contentId') contentId: string) {
    return this.interactionService.toggleFavorite(req.user.id, contentId);
  }

  @Post('follow/:contentId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle follow' })
  async toggleFollow(@Req() req: any, @Param('contentId') contentId: string) {
    return this.interactionService.toggleFollow(req.user.id, contentId);
  }

  @Post('report/comment')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Report a comment' })
  async reportComment(
    @Req() req: any,
    @Body() body: { commentId: string; type: string; description: string },
  ) {
    return this.interactionService.reportComment(req.user.id, body.commentId, body.type, body.description);
  }
}
