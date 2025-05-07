
import { Module } from '@nestjs/common';
import { NotificationGateway } from './notification/notification.gateway';
import { NotificationController } from './notification/notification.controller';
import { NotificationSse } from './notification/notification.sse'; // ✅ Import the SSE Service
import { NotificationModule } from './notification/notification.module';
import {PrismaModule} from './prisma/prisma.module'

@Module({
  imports:[NotificationModule, PrismaModule],
  providers: [NotificationGateway, NotificationSse], // ✅ Added NotificationSseService
  controllers: [NotificationController],
})
export class AppModule {}


