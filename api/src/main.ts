import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from '@fastify/helmet';
import compression from '@fastify/compress';
import * as os from 'os';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: true,
      bodyLimit: 10485760, // 10MB
      connectionTimeout: 30000,
      keepAliveTimeout: 30000,
      maxRequestsPerSocket: 1000,
      requestTimeout: 30000,
    }),
  );

  // Security & Optimization
  await app.register(helmet as any, {
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  });
  await app.register(compression as any, {
    encodings: ['gzip', 'deflate'],
    threshold: 512,
  });

  app.setGlobalPrefix('api/v1');

  // CORS — Allow all in dev, restrict in production
  app.enableCors({
    origin: (origin, callback) => {
      const allowed = [
        'localhost',
        '127.0.0.1',
        '.cinestream.com',
        '.vercel.app',
      ];
      if (!origin || allowed.some(a => origin.includes(a))) {
        callback(null, true);
      } else {
        callback(null, true); // Allow all for now
      }
    },
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization, X-Requested-With',
  });

  // Validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
    transformOptions: { enableImplicitConversion: true },
  }));

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('CineStream API')
    .setDescription('High-performance entertainment platform API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  const host = process.env.HOST || '0.0.0.0';

  await app.listen(port, host);
  console.log(`API running on http://${host}:${port}`);

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down...');
    await app.close();
    process.exit(0);
  });
}

// Cluster mode support
if (process.env.CLUSTER_MODE === 'true' && process.env.NODE_ENV === 'production') {
  const cluster = require('cluster');
  const numCPUs = parseInt(process.env.CLUSTER_WORKERS || '') || os.cpus().length;

  if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} running, forking ${numCPUs} workers`);
    for (let i = 0; i < numCPUs; i++) cluster.fork();
    cluster.on('exit', (worker: any) => {
      console.log(`Worker ${worker.process.pid} died, forking replacement`);
      cluster.fork();
    });
  } else {
    bootstrap();
  }
} else {
  bootstrap();
}
