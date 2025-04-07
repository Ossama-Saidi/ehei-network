import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../auth/JWT/jwt.strategy';
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import path from 'path';
import * as fs from 'fs';
import { FileUploadService } from 'src/file-upload/FileUploadService';
import { MulterModule } from '@nestjs/platform-express';
import { ClientsModule, Transport } from '@nestjs/microservices';
//import { FileUploadService } from '../file-upload/FileUploadService';

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads', // Temporary storage for uploaded files
    }),
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Use environment variable for JWT secret
      signOptions: { expiresIn: '2h' }, // Token expiration time
    }),
    ClientsModule.register([
      {
        name: 'GROUP_SERVICE',
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 4002, // Doit correspondre au port défini dans GROUP_SERVICE
        },
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy, PrismaService,FileUploadService],
  exports: [JwtStrategy, PassportModule, UserService, FileUploadService], // Export for use in other modules
})
export class UserModule {}