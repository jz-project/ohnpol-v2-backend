import { forwardRef, Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Post } from './post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { DecoCardsModule } from '../deco-cards/deco-cards.module';
import { DecoCard } from '../deco-cards/deco-card.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, DecoCard]),
    forwardRef(() => UsersModule),
    AuthModule,
    forwardRef(() => DecoCardsModule),
  ],
  providers: [PostsService],
  controllers: [PostsController],
  exports: [TypeOrmModule],
})
export class PostsModule {}
