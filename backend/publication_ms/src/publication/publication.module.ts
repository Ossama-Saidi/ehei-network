import { 
  Module, 
  // forwardRef 
} from '@nestjs/common';
import { PublicationService } from './publication.service';
import { PublicationController } from './publication.controller';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PublicationGateway } from './publication.gateway';
// import { ServeStaticModule } from '@nestjs/serve-static';
// import * as path from 'path';

@Module({
  imports: [
    PrismaModule,
  ],
  controllers: [PublicationController],
  providers: [
    PublicationService,
    PublicationGateway,
    PrismaService,
  ],
  exports: [PublicationService, PublicationGateway], // Export both services
})
export class PublicationModule {}