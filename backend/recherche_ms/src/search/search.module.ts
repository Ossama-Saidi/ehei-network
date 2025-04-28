import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Search } from './entities/search.entity';
import { User } from './entities/user.entity';
import { Groupe } from './entities/groupe.entity';
import { Tag } from './entities/tag.entity';
import { Publication } from './entities/publication.entity';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { TagService } from './tag.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Search, User, Groupe, Tag, Publication]),
    CacheModule.register(),
    PrismaModule,
    UsersModule
  ],
  providers: [SearchService, TagService, PrismaService],
  controllers: [SearchController],
})
export class SearchModule {}