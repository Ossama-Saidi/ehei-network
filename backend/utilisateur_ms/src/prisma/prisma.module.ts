import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Exporter PrismaService pour l'utiliser dans d'autres modules
})
export class PrismaModule {}
