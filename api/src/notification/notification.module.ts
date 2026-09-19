import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue({
      name: 'notifications',
    }),
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
