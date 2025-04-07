// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// // import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
// import { Logger } from '@nestjs/common';
// //import { ConfigService } from '@nestjs/config';
// // import { MicroserviceOptions, Transport } from '@nestjs/microservices';
// import path from 'path';
// import * as express from 'express'; // Add this import at the top
// //import fastifyCors from '@fastify/cors';

// async function bootstrap() {
//   // Create the Fastify-based HTTP server
//   // const app = await NestFactory.create<NestFastifyApplication>(
//   //   AppModule,
//   //   new FastifyAdapter(),
//   // );

//   const app = await NestFactory.create(AppModule, { cors: true });

//   // Get configuration from ConfigService
//   const port = 3002;
//   const frontendUrl = 'http://localhost:3000';
//   const userServiceHost = '127.0.0.1';
//   const userServicePort = 3001;
  
//   // Enable CORS for frontend communication
//   app.enableCors({
//     origin: frontendUrl,
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     credentials: true,
//   });
//   // await app.register(fastifyCors, {
//   //   origin: frontendUrl,
//   //   methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
//   //   credentials: true,
//   // });

//   // Setup TCP microservice for inter-service communication
//   // const microservice = app.connectMicroservice<MicroserviceOptions>({
//   //   transport: Transport.TCP,
//   //   options: {
//   //     host: '0.0.0.0',  // Listen on all interfaces
//   //     port: port + 1000, // Use port+1000 for TCP communication (e.g., 4002 for TCP if HTTP is 3002)
//   //   },
//   // });

//   app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
  
//   // Log microservice configuration
//   Logger.log(`Group microservice configuration:`);
//   Logger.log(`- HTTP Port: ${port}`);
//   Logger.log(`- TCP Port: ${port + 1000}`);
//   Logger.log(`- Frontend URL: ${frontendUrl}`);
//   Logger.log(`- User Service: http://${userServiceHost}:${userServicePort}`);

//   // Start both HTTP and microservice servers
//   await app.startAllMicroservices();
//   await app.listen(port, '0.0.0.0');
  
//   Logger.log(`Group microservice HTTP running on http://localhost:${port}`);
//   // Logger.log(`Group microservice TCP listening on port ${port + 1000}`);

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
import * as path from 'path';
import * as express from 'express';
import { existsSync, mkdirSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  // Configuration
  const port = 3002;
  const frontendUrl = 'http://localhost:3000';
  const userServiceHost = '127.0.0.1';
  const userServicePort = 3001;
  
  // CORS Configuration
  app.enableCors({
    origin: frontendUrl,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // File Upload Configuration
  const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
  
  // Ensure upload directory exists
  if (!existsSync(uploadsDir)) {
    mkdirSync(uploadsDir, { recursive: true });
    Logger.log(`Created uploads directory at ${uploadsDir}`);
  }

  // Serve static files
  app.use('/uploads', express.static(uploadsDir));
  Logger.log(`Serving static files from ${uploadsDir} at /uploads`);

  // Log service configuration
  Logger.log(`Group microservice configuration:`);
  Logger.log(`- HTTP Port: ${port}`);
  Logger.log(`- Frontend URL: ${frontendUrl}`);
  Logger.log(`- User Service: http://${userServiceHost}:${userServicePort}`);
  Logger.log(`- File uploads directory: ${uploadsDir}`);

  // Start the application
  await app.startAllMicroservices();
  await app.listen(port, '0.0.0.0');
  
  Logger.log(`Group microservice HTTP running on http://localhost:${port}`);

  // Graceful shutdown handling
  process.on('SIGINT', async () => {
    Logger.log('Shutting down Group Service...');
    await app.close();
    process.exit(0);
  });
}

bootstrap();