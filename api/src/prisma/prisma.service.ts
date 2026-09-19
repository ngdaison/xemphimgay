import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@webtruyenphim/database';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    try {
      await this.$connect();
      console.log('Successfully connected to Database');
    } catch (error) {
      console.error('Failed to connect to Database. Please ensure Postgres is running.');
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
