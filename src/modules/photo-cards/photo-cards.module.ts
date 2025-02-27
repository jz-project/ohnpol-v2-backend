import { Module } from '@nestjs/common';
import { PhotoCardsService } from './photo-cards.service';
import { PhotoCardsController } from './photo-cards.controller';
import { PhotoCard } from './photo-card.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PhotoCard])],
  providers: [PhotoCardsService],
  controllers: [PhotoCardsController],
})
export class PhotoCardsModule {}
