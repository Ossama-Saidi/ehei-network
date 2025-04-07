// Le service fonctionnera à la fois comme:

// Une API HTTP REST avec Fastify sur le port HTTP_PORT
// Un microservice TCP sur le port MICROSERVICE_PORT

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import multiPart from '@fastify/multipart';
import * as path from 'path';
// import fastifyStatic from '@fastify/static';

async function bootstrap() {
//-------------------------------------------------------------------------------------------------
  // Créer un adaptateur Fastify
  // const fastifyAdapter = new FastifyAdapter({ logger: true });

  // Configurer CORS dans l'adaptateur Fastify avant de créer l'application
  // fastifyAdapter.enableCors({
  //   origin: true,
  //   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
  //   credentials: true,
  // });

  // Créer l'application avec l'adaptateur déjà configuré
  //  const app = await NestFactory.create(AppModule, fastifyAdapter);
//---------------------------------------------------------------------------------------------------
const app = await NestFactory.create<NestFastifyApplication>(
  AppModule,
  new FastifyAdapter({
    logger: true,
  }),
);
// Configuration du préfixe API global
app.setGlobalPrefix('api');
  // Register Fastify multipart plugin
  // await app.register(multiPart);
  await app.register(require('@fastify/multipart'), {
    limits: {
      fieldNameSize: 100, // Max field name size in bytes
      fieldSize: 5 * 1024 * 1024,     // Max field value size in bytes 5MB
      fields: 10,         // Max number of non-file fields
      fileSize: 1000000,  // For multipart forms, the max file size in bytes
      files: 1,           // Max number of file fields
      headerPairs: 2000,  // Max number of header key=>value pairs
      parts: 1000         // For multipart forms, the max number of parts (fields + files)
    }
  });
    // Servir les fichiers statiques (public)
    // Configuration explicite pour les fichiers statiques
  app.useStaticAssets({
    root: path.join(__dirname, '..', 'public'),
    index: false,
    prefix: '/public',
    decorateReply: false // Important pour Fastify
});
  // Configurer CORS dans l'adaptateur Fastify avant de créer l'application
  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
    credentials: true,
  });
  // Utiliser directement les variables d'environnement via process.env
  const dbUrl = process.env.DATABASE_URL;
  const port = parseInt(process.env.HTTP_PORT);
  const microservicePort = parseInt(process.env.MICROSERVICE_PORT);

  console.log(`Database URL: ${dbUrl}`);
  console.log(`HTTP Port: ${port}`);
  console.log(`Microservice Port: ${microservicePort}`);

  // Configuration du validateur global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.url}`);
    next();
  });
  //   // Configuration CORS
  //   app.enableCors({
  //   origin: true,//'http://localhost:3000',  Remplacez par l'URL de l'application Next.js
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  //   credentials: true,
  // });

  // Configurer l'application comme microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: microservicePort,
    },
  });

  // Démarrer tous les microservices
  await app.startAllMicroservices();

  // Puis démarrer l'application web
  await app.listen(port, '0.0.0.0');

  // Configuration pour servir les fichiers statiques
  // app.useStaticAssets(join(__dirname, '..', 'public'));

  console.log(
    `PUB-SERVICE running on ports: HTTP ${port}, Microservice ${microservicePort}`,
  );
}

bootstrap();
