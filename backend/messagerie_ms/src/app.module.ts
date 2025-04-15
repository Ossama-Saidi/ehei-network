import { Module } from '@nestjs/common';
import { MessagesModule } from './messages/messages.module';
import { PrismaService } from './prisma/prisma.service';
import { AppController } from './app.controller';
// import { MessagesController } from './messages/messages.controller';
import { MessagesService } from './messages/messages.service';
// import { AuthModule } from '../../user-service/src/auth/auth.module';
import {JwtService } from '@nestjs/jwt';
import { NotificationGateway } from '../../notification_ms/src/notification/notification.gateway';
import { NotificationSse} from '../../notification_ms/src/notification/notification.sse';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AppService } from './app.service';

@Module({
  imports: 
  [
      ConfigModule.forRoot({
        isGlobal: true,
      }),
      MessagesModule,
      PrismaModule,
    ],  // MessagesModule contient déjà MessagesController
  controllers: [AppController],  // MessagesController est déjà inclus dans MessagesModule
  providers: [AppService]
})
export class AppModule {}


