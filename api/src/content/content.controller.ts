import { Controller, Get, Param, Query } from '@nestjs/common';
import { ContentService } from './content.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('contents')
@Controller('contents')
export class ContentController {
  constructor(private contentService: ContentService) {}

  @Get()
  @ApiOperation({ summary: 'Get list of contents with filters' })
  async getAll(@Query() query: any) {
    return this.contentService.findAll(query);
  }

  @Get('home')
  @ApiOperation({ summary: 'Get home page content sections' })
  async getHome() {
    return this.contentService.getHomeContent();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get content detail by slug' })
  async getDetail(@Param('slug') slug: string) {
    return this.contentService.getContentBySlug(slug);
  }

  @Get(':id/related')
  @ApiOperation({ summary: 'Get related content' })
  async getRelated(@Param('id') id: string) {
    const content = await this.contentService.getDetail(id);
    const genreIds = content.genres.map(g => g.genreId);
    return this.contentService.getRelatedContent(id, content.type, genreIds);
  }
}
