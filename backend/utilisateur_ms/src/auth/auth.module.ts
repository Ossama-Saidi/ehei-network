import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './JWT/jwt.strategy';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MailService } from 'src/mail/mail.service';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PUBLICATION_EVENTS_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://user:password@localhost:5673'],
          queue: 'user_events_queue', // 📢 This is the queue to emit events to
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
    PassportModule,
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default_secret', // Use environment variable for JWT secret
      signOptions: { expiresIn: '24h' }, // Token expiration time
    }),
    MailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtStrategy], // Export JwtStrategy for use in other modules
})
export class AuthModule {}