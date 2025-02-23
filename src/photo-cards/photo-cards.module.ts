import { Module } from '@nestjs/common';
import { PhotoCardsService } from './photo-cards.service';
import { PhotoCardsController } from './photo-cards.controller';

@Module({
  providers: [PhotoCardsService],
  controllers: [PhotoCardsController]
})
export class PhotoCardsModule {}
