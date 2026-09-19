import { Controller, Get, Post, Delete, UseGuards, UseInterceptors, UploadedFile, Body, Param } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiTags, ApiOperation, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('super_admin')
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('contents')
  @ApiOperation({ summary: 'List all contents for management' })
  async listContents() {
    return this.adminService.listAllContents();
  }

  @Get('contents/:id')
  @ApiOperation({ summary: 'Get content detail for editing' })
  async getContent(@Param('id') id: string) {
    return this.adminService.getContentById(id);
  }

  @Post('contents')
  @ApiOperation({ summary: 'Create new content' })
  async createContent(@Body() data: any) {
    return this.adminService.createContent(data);
  }

  @Post('contents/:id/episodes')
  @ApiOperation({ summary: 'Add episode to anime/video' })
  async addEpisode(@Param('id') id: string, @Body() data: any) {
    return this.adminService.addEpisode(id, data);
  }

  @Post('contents/:id/chapters')
  @ApiOperation({ summary: 'Add chapter to manga/story' })
  async addChapter(@Param('id') id: string, @Body() data: any) {
    return this.adminService.addChapter(id, data);
  }

  @Post('video/upload')
  @UseInterceptors(FileInterceptor('video', {
    storage: diskStorage({
      destination: './media/uploads',
      filename: (req: any, file: any, cb: any) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        cb(null, `${randomName}${extname(file.originalname)}`);
      },
    }),
  }))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload raw video for transcoding' })
  async uploadVideo(
    @UploadedFile() file: Express.Multer.File,
    @Body('episodeId') episodeId: string,
  ) {
    return this.adminService.triggerTranscode(episodeId, file.path);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  async getStats() {
    return this.adminService.getDashboardStats();
  }

  @Delete('contents/:id')
  @ApiOperation({ summary: 'Delete content' })
  async deleteContent(@Param('id') id: string) {
    return this.adminService.deleteContent(id);
  }
}
