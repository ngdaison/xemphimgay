import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'transcode',
    }),
  ],
  providers: [AdminService],
  controllers: [AdminController]
})
export class AdminModule {}
