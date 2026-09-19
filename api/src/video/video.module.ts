import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { MediaModule } from '../media/media.module';

@Module({
  imports: [MediaModule],
  providers: [VideoService],
  controllers: [VideoController]
})
export class VideoModule {}
