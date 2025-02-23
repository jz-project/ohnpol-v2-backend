import { IsNotEmpty } from 'class-validator';
import { Timestamp } from 'typeorm';

export class CreateDecoCardDto {
  @IsNotEmpty()
  decoCard: string;

  @IsNotEmpty()
  savedDatetime: Timestamp;
}
