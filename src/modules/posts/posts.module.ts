import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Post } from './post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  providers: [PostsService],
  controllers: [PostsController],
  exports: [TypeOrmModule],
})
export class PostsModule {}
