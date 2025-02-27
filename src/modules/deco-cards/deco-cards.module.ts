import { Module } from '@nestjs/common';
import { DecoCardsController } from './deco-cards.controller';
import { DecoCard } from './deco-card.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DecoCardsService } from './deco-cards.service';

@Module({
  imports: [TypeOrmModule.forFeature([DecoCard])],
  providers: [DecoCardsService],
  controllers: [DecoCardsController],
})
export class DecoCardsModule {}
