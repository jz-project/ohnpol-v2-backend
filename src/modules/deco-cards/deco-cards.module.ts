import { Module } from '@nestjs/common';
import { DecoCardsController } from './deco-cards.controller';
import { DecoCard } from './deco-card.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DecoCardsService } from './deco-cards.service';
import { UsersModule } from '../users/users.module';
import { PhotoCardsModule } from '../photo-cards/photo-cards.module';
import { User } from '../users/user.entity';
import { PhotoCard } from '../photo-cards/photo-card.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DecoCard, User, PhotoCard]), // PhotoCard 엔티티 추가
    UsersModule,
    PhotoCardsModule,
    AuthModule,
  ],
  providers: [DecoCardsService],
  controllers: [DecoCardsController],
  exports: [DecoCardsService],
})
export class DecoCardsModule {}
