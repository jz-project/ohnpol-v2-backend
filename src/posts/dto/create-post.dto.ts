import { IsNotEmpty } from 'class-validator';
import { Timestamp } from 'typeorm';

export class CreatePostDto {
  @IsNotEmpty()
  postedDatetime: Timestamp;
}
