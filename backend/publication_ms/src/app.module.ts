import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PublicationModule } from './publication/publication.module';
import { PrismaModule } from './prisma/prisma.module';
import { PublicationSavesModule } from './publication-saves/publication-saves.module';
import { UsersModule } from './users/users.module';
import { ReactionModule } from './reaction/reaction.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PublicationModule,
    PrismaModule,
    UsersModule,
    PublicationSavesModule,
    ReactionModule,
    CommentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
