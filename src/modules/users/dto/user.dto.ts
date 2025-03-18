import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserRegisterDto {
  @IsEmail()
  @ApiProperty({
    description: '이메일 주소',
    example: 'ohnpol@example.com',
  })
  email: string;

  @IsNotEmpty()
  @ApiProperty({
    description: '비밀번호',
    example: 'ohnpol1004',
  })
  password: string;

  @IsNotEmpty()
  @ApiProperty({
    description: '닉네임',
    example: '온폴이',
  })
  nickname: string;
}

export class UserLogInDto {
  @IsEmail()
  @ApiProperty({
    description: '이메일 주소',
    example: 'ohnpol@example.com',
  })
  email: string;

  @IsNotEmpty()
  @ApiProperty({
    description: '비밀번호',
    example: 'ohnpol1004',
  })
  password: string;
}

export class UserProfileDto {
  @IsNotEmpty()
  @ApiProperty({
    description: '닉네임',
    example: '온폴이',
  })
  nickname: string;

  @IsString()
  @ApiProperty({
    description: '프로필 사진',
  })
  avatar: string;

  @IsString()
  @ApiProperty({
    description: '자기소개',
    example: '안녕?',
  })
  biography: string;
}
