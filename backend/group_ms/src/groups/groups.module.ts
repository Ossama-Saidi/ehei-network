import { Module, forwardRef } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { GroupsGateway } from './groups.gateway';
import { AuthModule } from '../auth/auth.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PrismaService } from 'src/prisma/prisma.service';
// import { UploadService } from 'src/modules/uploads/upload.service';
import { NotificationService } from './NotificationService/services/notification.service';
import { StorageService } from 'src/shered/storage/storage.service';
import { StorageModule } from '../shered/storage/storage.module';
// import { UploadModule } from 'src/modules/uploads/upload.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    /*UploadModule,*/
    PrismaModule,
    StorageModule,
    AuthModule,
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 3001
        }
      },
      {
        name: 'NOTIFICATION_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3004
        }
      },
      {
        name: 'PUBLICATION_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3003
        }
      }
    ])
  ],
  controllers: [GroupsController],
  providers: [
    GroupsService,
    GroupsGateway,
    PrismaService,
    /*UploadService,*/
    NotificationService
  ],
  exports: [GroupsService, GroupsGateway, NotificationService]
})
export class GroupsModule {}