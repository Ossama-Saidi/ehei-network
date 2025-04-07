import { Module } from '@nestjs/common';
import { PublicationSavesService } from './publication-saves.service';
import { PublicationSavesController } from './publication-saves.controller';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
      PrismaModule,
    ],
  controllers: [PublicationSavesController],
  providers: [
    PublicationSavesService,
    PrismaService,
  ],
  exports: [PublicationSavesService],
})
export class PublicationSavesModule {}
