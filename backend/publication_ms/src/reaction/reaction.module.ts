import { forwardRef, Module } from '@nestjs/common';
import { ReactionService } from './reaction.service';
import { ReactionController } from './reaction.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ReactionGateway } from './reaction.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserCacheService } from 'src/users/user-cache.service';

@Module({
  imports: [
      PrismaModule,
      forwardRef(() => AuthModule),
      forwardRef(() => UsersModule),
      JwtModule.register({
        secret: process.env.JWT_SECRET || 'default_secret',
      }),
    ],
  controllers: [ReactionController],
  providers: [
    ReactionService, 
    ReactionGateway,
  ],
  exports: [ReactionService, ReactionGateway], // Export both services
})
export class ReactionModule {}
