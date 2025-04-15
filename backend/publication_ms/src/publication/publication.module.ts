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
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt'; // 👈 ajoute cette ligne
import { UserCacheService } from '../users/user-cache.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default_secret',
    }),
  ],
  controllers: [PublicationController],
  providers: [
    PublicationService,
    PublicationGateway,
    PrismaService,
    UserCacheService,
  ],
  exports: [PublicationService, PublicationGateway], // Export both services
})
export class PublicationModule {}