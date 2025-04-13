import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Logger } from '@nestjs/common';
//import { ConfigService } from '@nestjs/config';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
// import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';

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

  // Configuration du microservice RabbitMQ
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://user:password@localhost:5672'],
      queue: 'auth_queue',
      queueOptions: {
        durable: true
      },
    },
  });
  // Another RabbitMQ connection for user events EVENT DRIVEN APRAOCH
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://user:password@localhost:5672'],
      queue: 'user_events_queue',
      queueOptions: {
        durable: true
      },
    },
  });
  // Set up event listeners to publish to RabbitMQ
  // const eventEmitter = app.get(EventEmitter2);
  // const userEventsClient = app.get('USER_EVENTS_SERVICE'); // You'll need to register this client

  // eventEmitter.on('user.created', (user) => {
  //   userEventsClient.emit('user.created', user);
  //   console.log(`[USER_SERVICE] 📢 Published user.created event for user ID: ${user.id}`);
  // });
  
  // eventEmitter.on('user.updated', (user) => {
  //   userEventsClient.emit('user.updated', user);
  //   console.log(`[USER_SERVICE] 📢 Published user.updated event for user ID: ${user.id}`);
  // });
  
  // eventEmitter.on('user.deleted', (payload) => {
  //   userEventsClient.emit('user.deleted', payload);
  //   console.log(`[USER_SERVICE] 📢 Published user.deleted event for user ID: ${payload.id}`);
  // });

  // Log microservice configuration
  Logger.log(`User microservice configuration:`);
  Logger.log(`- Port: ${port}`);
  Logger.log(`- Frontend URL: ${frontendUrl}`);
  Logger.log(`- Group Service: http://${groupServiceHost}:${groupServicePort}`);

  // Start the server
  await app.listen(port/*, '0.0.0.0'*/);
  await app.startAllMicroservices();
  Logger.log(`User microservice running on http://localhost:${port}`);
  // console.log(`[USER_SERVICE] 🚀 Application is running on: ${await app.getUrl()}`);
}

bootstrap();