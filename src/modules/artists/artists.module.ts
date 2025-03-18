import { forwardRef, Module } from '@nestjs/common';
import { ArtistsController } from './artists.controller';
import { ArtistsService } from './artists.service';
import { Artist } from './artist.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { PostsModule } from '../posts/posts.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Artist]),
    forwardRef(() => UsersModule),
    forwardRef(() => AuthModule),
    PostsModule,
  ],
  providers: [ArtistsService],
  controllers: [ArtistsController],
  exports: [TypeOrmModule],
})
export class ArtistsModule {}
