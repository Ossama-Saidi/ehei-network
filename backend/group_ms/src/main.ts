// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { Logger } from '@nestjs/common';
// import { join } from 'path';
// import * as express from 'express';
// import { existsSync, mkdirSync } from 'fs';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule, { cors: true });

//   // Configuration
//   const port = 3002;
//   const frontendUrl = 'http://localhost:3000';
//   const userServiceHost = '127.0.0.1';
//   const userServicePort = 3001;
  
//   // CORS Configuration
//   app.enableCors({
//     origin: frontendUrl,
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     credentials: true,
//   });

//   // File Upload Configuration
//   const uploadsDir = join(__dirname, '..','..','..', 'uploads');
//   const bannersDir = join(uploadsDir, 'banners');
  
//   // Create directories if they don't exist
//   // if (!existsSync(uploadsDir)) {
//   //   mkdirSync(uploadsDir, { recursive: true });
//   //   Logger.log(`Created uploads directory at ${uploadsDir}`);
//   // }
//   // if (!existsSync(bannersDir)) {
//   //   mkdirSync(bannersDir, { recursive: true });
//   //   Logger.log(`Created banners directory at ${bannersDir}`);
//   // }

//   // Serve static files with explicit configuration
//   // app.use('/uploads', express.static(uploadsDir, {
//   //   index: false,
//   //   fallthrough: true,
//   //   setHeaders: (res) => {
//   //     res.setHeader('Access-Control-Allow-Origin', '*');
//   //     res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
//   //   }
//   // }));
//   app.useStaticAssets(join(__dirname, '..', 'uploads'), {
//     prefix: '/uploads/',
//   });

//   Logger.log(`Serving static files from: ${uploadsDir}`);

//   // Log service configuration
//   Logger.log(`Group microservice configuration:`);
//   Logger.log(`- HTTP Port: ${port}`);
//   Logger.log(`- Frontend URL: ${frontendUrl}`);
//   Logger.log(`- User Service: http://${userServiceHost}:${userServicePort}`);
//   Logger.log(`- File uploads directory: ${uploadsDir}`);
//   Logger.log(`- Banners directory: ${bannersDir}`);

//   // Start the application
//   await app.startAllMicroservices();
//   await app.listen(port, '0.0.0.0');
  
//   Logger.log(`Group microservice HTTP running on http://localhost:${port}`);

//   // Graceful shutdown handling
//   process.on('SIGINT', async () => {
//     Logger.log('Shutting down Group Service...');
//     await app.close();
//     process.exit(0);
//   });
// }

// bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { cors: true });

  // Configuration
  const port = 3002;
  const frontendUrl = 'http://localhost:3000';
  const userServiceHost = '127.0.0.1';
  const userServicePort = 3001;

  // CORS
  app.enableCors({
    origin: frontendUrl,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Upload directories
  const uploadsDir = join(__dirname, '..', 'uploads');
  const bannersDir = join(uploadsDir, 'banners');

  // Create directories if needed
  [uploadsDir, bannersDir].forEach((dir) => {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
      Logger.log(`Created directory: ${dir}`);
    }
  });

  // Serve static files
  app.useStaticAssets(uploadsDir, {
    prefix: '/uploads/',
  });

  Logger.log(`Static files served from: ${uploadsDir}`);
  Logger.log(`Group microservice config:`);
  Logger.log(`- HTTP Port: ${port}`);
  Logger.log(`- Frontend URL: ${frontendUrl}`);
  Logger.log(`- User Service: http://${userServiceHost}:${userServicePort}`);
  Logger.log(`- Upload Path: ${uploadsDir}`);
  Logger.log(`- Banners Path: ${bannersDir}`);

  // Start
  await app.startAllMicroservices();
  await app.listen(port, '0.0.0.0');
  Logger.log(`🚀 Group microservice running at http://localhost:${port}`);

  // Graceful shutdown
  process.on('SIGINT', async () => {
    Logger.log('Shutting down Group Service...');
    await app.close();
    process.exit(0);
  });
}

bootstrap();
