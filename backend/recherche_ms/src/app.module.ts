import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchModule } from './search/search.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { CacheModule } from '@nestjs/cache-manager';
import * as memoryStore from 'cache-manager-memory-store';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'search_db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    SearchModule,
    PrismaModule,
    UsersModule,
    CacheModule.register({
      store: memoryStore, // Utiliser le memory store
      max: 100,            // max items dans le cache
      ttl: 60 * 60,        // TTL par défaut (en secondes)
      isGlobal: true,      // Cache accessible globalement
    }),
  ],
})
export class AppModule {}
