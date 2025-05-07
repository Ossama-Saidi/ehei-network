// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuration CORS pour le frontend Next.js
 app.enableCors({
     origin: true,
     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
     credentials: true,
   });

    // Connect to RabbitMQ for user events
     app.connectMicroservice<MicroserviceOptions>({
       transport: Transport.RMQ,
       options: {
         urls: ['amqp://user:password@localhost:5673'],
         queue: 'user_events_queue',
         queueOptions: {
           durable: true
         },
       },
     });

  await app.listen(3006); // Port du backend
  await app.startAllMicroservices();
  console.log(`🚀 Backend démarré sur http://localhost:3006`);
}

bootstrap();