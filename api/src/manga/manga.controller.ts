import { Controller, Get, Param } from '@nestjs/common';
import { MangaService } from './manga.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('mangas')
@Controller('mangas')
export class MangaController {
  constructor(private mangaService: MangaService) {}

  @Get('chapter/:id')
  @ApiOperation({ summary: 'Get manga chapter by ID' })
  async getChapter(@Param('id') id: string) {
    return this.mangaService.getChapter(id);
  }
}
