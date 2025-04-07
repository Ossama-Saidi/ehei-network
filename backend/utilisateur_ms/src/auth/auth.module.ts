import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './JWT/jwt.strategy';

@Module({
  imports: [
    AuthModule,
    PassportModule,
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default_secret', // Use environment variable for JWT secret
      signOptions: { expiresIn: '2h' }, // Token expiration time
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService], // Export JwtStrategy for use in other modules
})
export class AuthModule {}