// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuration CORS pour le frontend Next.js
  app.enableCors({
    origin: 'http://localhost:3000', // Port du frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  });

  await app.listen(3006); // Port du backend
  console.log(`🚀 Backend démarré sur http://localhost:3006`);
}

bootstrap();