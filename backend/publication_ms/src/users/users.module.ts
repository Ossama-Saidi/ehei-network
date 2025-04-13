// publication-service/src/users/users.module.ts
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserCacheService } from './user-cache.service';
import { UsersEventsController } from './users-events.controller';
import { UsersController } from './users.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://user:password@localhost:5672'],
          queue: 'user_events_queue',
          queueOptions: {
            durable: true
          },
        },
      },
      // {
      //   name: 'USER_EVENTS_SERVICE',
      //   transport: Transport.RMQ,
      //   options: {
      //     urls: ['amqp://user:password@localhost:5672'],
      //     queue: 'user_events_queue',
      //     queueOptions: {
      //       durable: true
      //     },
      //   },
      // }
    ]),
  ],
  controllers: [UsersEventsController,UsersController],
  providers: [UserCacheService],
  exports: [UserCacheService],
})
export class UsersModule {}