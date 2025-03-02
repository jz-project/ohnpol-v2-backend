import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from 'node_modules/@nestjs/swagger';
import { Timestamp } from 'typeorm';

export class CreatePostDto {
  @IsNotEmpty()
  postedDatetime: Timestamp;
}

export class UserLike {
  @IsNumber()
  @ApiProperty({
    description: '포스트 번호',
    example: 1,
  })
  id: number;
}
