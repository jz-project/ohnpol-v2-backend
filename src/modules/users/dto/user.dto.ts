import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserRegisterDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  nickname: string;
}

export class UserLogInDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
