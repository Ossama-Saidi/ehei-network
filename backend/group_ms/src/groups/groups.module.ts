// Update groups.module.ts
import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { GroupsGateway } from './groups.gateway';
import { AuthModule } from '../auth/auth.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [PrismaModule, AuthModule, 
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: { 
          host: '127.0.0.1', 
          port: 3001 }, // User Microservice Address
      },
    ]),
  ],
  controllers: [GroupsController, GroupsGateway],
  providers: [GroupsService],
  exports: [GroupsService],
})
export class GroupsModule {}