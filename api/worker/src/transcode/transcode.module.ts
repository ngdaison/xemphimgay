import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { TranscodeProcessor } from './transcode.processor';
import { TranscodeService } from './transcode.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'transcode',
    }),
  ],
  providers: [TranscodeProcessor, TranscodeService],
  exports: [TranscodeService],
})
export class TranscodeModule {}
