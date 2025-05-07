import { Module } from '@nestjs/common';
import { PublicationSavesService } from './publication-saves.service';
import { PublicationSavesController } from './publication-saves.controller';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
      PrismaModule,
      AuthModule
    ],
  controllers: [PublicationSavesController],
  providers: [
    PublicationSavesService,
    PrismaService,
  ],
  exports: [PublicationSavesService],
})
export class PublicationSavesModule {}
