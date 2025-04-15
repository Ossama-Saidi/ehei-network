import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://user:password@localhost:5672'],
          queue: 'auth_queue',
          queueOptions: {
            durable: true
          },
        },
      },
    ]),
  ],
  providers: [AuthGuard],
  exports: [AuthGuard, ClientsModule], // Pour pouvoir utiliser le guard ailleurs
})
export class AuthModule {}