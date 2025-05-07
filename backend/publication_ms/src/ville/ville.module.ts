import { forwardRef, Module } from '@nestjs/common';
import { VilleService } from './ville.service';
import { VilleController } from './ville.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
        PrismaModule,
        forwardRef(() => AuthModule),
        forwardRef(() => UsersModule),
        JwtModule.register({
          secret: process.env.JWT_SECRET || 'default_secret',
        }),
      ],
  controllers: [VilleController],
  providers: [VilleService],
})
export class VilleModule {}
