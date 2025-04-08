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

@Module({
  imports: [
    TypeOrmModule.forFeature([Search, User, Groupe, Tag, Publication]),
    CacheModule.register(),
  ],
  providers: [SearchService, TagService],
  controllers: [SearchController],
})
export class SearchModule {}