// // Enhance app.module.ts
// import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { GroupsModule } from './groups/groups.module';
// import { PrismaModule } from './prisma/prisma.module';
// import { ClientsModule, Transport } from '@nestjs/microservices';

// @Module({
//   imports: [
//     GroupsModule,
//     PrismaModule,
//     ClientsModule.register([
//       {
//         name: 'user_service',
//         transport: Transport.TCP,
//         options: { host: '127.0.0.1', port: 4000 },
//       },
//     ]),
//   ],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GroupsModule } from './groups/groups.module';
import { PrismaModule } from './prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth/jwt.strategy';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GroupsModule,
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default_secret',
      signOptions: { expiresIn: '6h' },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
  
})
export class AppModule {}