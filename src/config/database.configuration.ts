import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/users/user.entity';
import { Artist } from 'src/artists/artist.entity';
import { PhotoCard } from 'src/photo-cards/photo-card.entity';
import { Collection } from 'src/collections/collection.entity';
import { DecoCard } from 'src/deco-cards/deco-card.entity';
import { Post } from 'src/posts/post.entity';

export const getTypeOrmConfig = (
  ConfigService: ConfigService
): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: ConfigService.get<string>('DB_HOST'),
  port: ConfigService.get<number>('DB_PORT'),
  username: ConfigService.get<string>('DB_USERNAME'),
  password: ConfigService.get<string>('DB_PASSWORD'),
  database: ConfigService.get<string>('DB_NAME'),
  entities: [User, Artist, PhotoCard, Collection, DecoCard, Post],
  synchronize: true, // 개발 환경에서만 true로 설정 (배포 환경에서는 false)
});
