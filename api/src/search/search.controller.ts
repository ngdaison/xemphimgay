import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiOperation({ summary: 'Search for content' })
  async search(
    @Query('q') query: string,
    @Query('type') type?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.searchService.searchContent(query, type, page, limit);
  }

  @Get('suggestions')
  @ApiOperation({ summary: 'Get search suggestions' })
  async getSuggestions(@Query('q') query: string) {
    return this.searchService.getSuggestions(query);
  }
}
