import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { AuthModule } from '../auth/auth.module'; // 👈 Importer le module
// import { AuthGuard } from '../../../user-service/src/auth/auth.guard';// 👈 Optionnel si utilisé dans providers
import { JwtModule } from '@nestjs/jwt';
import { NotificationGateway } from '../../../notification_ms/src/notification/notification.gateway';
import { NotificationSse } from '../../../notification_ms/src/notification/notification.sse';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';
@Module({
  imports: [
    PrismaModule,
    JwtModule.register({ secret: process.env.JWT_SECRET }),
    AuthModule
  ],
   
  providers: [
    MessagesService,
    PrismaService,
    NotificationGateway,
    NotificationSse,
    
  ],
  controllers: [MessagesController],
  exports: [MessagesService,NotificationGateway,NotificationSse]
})
export class MessagesModule {}
