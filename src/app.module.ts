import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getTypeOrmConfig } from './config/database.configuration';
import { UsersModule } from './users/users.module';
import { ArtistsModule } from './artists/artists.module';
import { PhotoCardsModule } from './photo-cards/photo-cards.module';
import { DecoCardsService } from './deco-cards/deco-cards.service';
import { DecoCardsModule } from './deco-cards/deco-cards.module';
import { PostsModule } from './posts/posts.module';
import { CollectionsModule } from './collections/collections.module';
import { LikesModule } from './likes/likes.module';
import { FavoritesModule } from './favorites/favorites.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // ConfigModule을 전역 모듈로 설정
      envFilePath: '.env', // 환경 변수 파일 경로 설정
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getTypeOrmConfig,
    }),
    UsersModule,
    ArtistsModule,
    PhotoCardsModule,
    DecoCardsModule,
    PostsModule,
    CollectionsModule,
    LikesModule,
    FavoritesModule,
  ],
  controllers: [AppController],
  providers: [AppService, DecoCardsService],
})
export class AppModule {}
