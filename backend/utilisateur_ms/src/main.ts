// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { FastifyAdapter, NestFastifyApplication} from '@nestjs/platform-fastify';
// import { Logger } from '@nestjs/common';
// // import * as fastifyCors from '@fastify/cors';

// //import { join } from 'path';
// //import * as express from 'express';
// //import fastifyMultipart from '@fastify/multipart';

// async function bootstrap() {
//   const app = await NestFactory.create<NestFastifyApplication>(
//     AppModule,
//     new FastifyAdapter(),
//   );

//   // Enregistre le plugin multipart
//   //app.register(fastifyMultipart);

//   // Enable CORS
//   app.enableCors({
//     origin: 'http://localhost:3000', // Replace with your frontend URL
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     credentials: true,
//   });
  
//  // Serve static files from the "uploads" directory with a prefix
//  // Serve static files
//   /*app.useStaticAssets({
//     root: join(__dirname, '..', 'public'),
//     prefix: '/',
//   });
// */
//   await app.listen(process.env.PORT ?? 3001);
//   const server = app.getHttpAdapter();
//   Logger.log(`Routes: ${JSON.stringify(server.getInstance().route)}`);
//   console.log('Authentication microservice running on http://localhost:3001');
// }
// bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Logger } from '@nestjs/common';
//import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  const port = 3001;
  const frontendUrl = 'http://localhost:3000';
  const groupServiceHost = '127.0.0.1';
  const groupServicePort = 3002;
  
  // Enable CORS for frontend communication
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Log microservice configuration
  Logger.log(`User microservice configuration:`);
  Logger.log(`- Port: ${port}`);
  Logger.log(`- Frontend URL: ${frontendUrl}`);
  Logger.log(`- Group Service: http://${groupServiceHost}:${groupServicePort}`);

  // Start the server
  await app.listen(port/*, '0.0.0.0'*/);
  Logger.log(`User microservice running on http://localhost:${port}`);
}

bootstrap();