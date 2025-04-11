import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationGateway } from './notification.gateway';
import { NotificationSse } from './notification.sse';
import { NotificationService } from './notification.service';
import { NotificationRepository } from './notification.repository';
import {PrismaModule} from '../prisma/prisma.module'
import { PrismaService } from '../prisma/prisma.service';


@Module({
  imports:[PrismaModule],
  providers: [NotificationGateway, NotificationService, NotificationSse, NotificationRepository, PrismaService], 
  controllers: [NotificationController],  //jpns qu'il faut eliminer NotificationSse de "controllers"
  exports: [NotificationService, NotificationSse, NotificationGateway, NotificationRepository],
})
export class NotificationModule {}
