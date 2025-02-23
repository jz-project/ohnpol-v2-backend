import { Module } from '@nestjs/common';
import { DecoCardsController } from './deco-cards.controller';

@Module({
  controllers: [DecoCardsController],
})
export class DecoCardsModule {}
