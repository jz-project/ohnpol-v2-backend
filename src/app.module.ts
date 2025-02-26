import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getTypeOrmConfig } from './config/database.configuration';
import { UsersModule } from './modules/users/users.module';
import { ArtistsModule } from './modules/artists/artists.module';
import { PhotoCardsModule } from './modules/photo-cards/photo-cards.module';
import { DecoCardsService } from './modules/deco-cards/deco-cards.service';
import { DecoCardsModule } from './modules/deco-cards/deco-cards.module';
import { PostsModule } from './modules/posts/posts.module';
import { CollectionsModule } from './modules/collections/collections.module';
import { AuthModule } from './modules/auth/auth.module';

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
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, DecoCardsService],
})
export class AppModule {}
