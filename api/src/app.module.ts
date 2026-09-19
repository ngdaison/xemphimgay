import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ContentModule } from './content/content.module';
import { StoryModule } from './story/story.module';
import { MangaModule } from './manga/manga.module';
import { VideoModule } from './video/video.module';
import { AdminModule } from './admin/admin.module';
import { InteractionModule } from './interaction/interaction.module';
import { HistoryModule } from './history/history.module';
import { NotificationModule } from './notification/notification.module';
import { SearchModule } from './search/search.module';
import { MediaModule } from './media/media.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env',
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get('REDIS_HOST', 'localhost'),
          port: configService.get('REDIS_PORT', 6379),
        },
      }),
      inject: [ConfigService],
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    ContentModule,
    StoryModule,
    MangaModule,
    VideoModule,
    AdminModule,
    InteractionModule,
    HistoryModule,
    NotificationModule,
    SearchModule,
    MediaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
