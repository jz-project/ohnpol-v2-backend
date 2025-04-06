import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLogInDto, UserRegisterDto } from '../users/dto/user.dto';
import { ValidationError } from 'class-validator';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // 회원가입
  @Post('/registration')
  @ApiResponse({ status: 201, description: '회원가입이 완료되었습니다.' })
  @ApiResponse({
    status: 400,
    description: '잘못된 이메일/비밀번호 조건 불충족/ 닉네임 중복/이미 가입함',
  })
  @UsePipes(
    new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => {
        const errorMessages = errors.map((error) => {
          if (error.property === 'email') {
            return '잘못된 이메일입니다.';
          }
          return Object.values(error.constraints || {}).join(', ');
        });
        return new BadRequestException({
          success: false,
          statusCode: 400,
          error: errorMessages,
        });
      },
    })
  )
  async register(@Body() userRegisterDto: UserRegisterDto) {
    return this.authService.register(userRegisterDto);
  }

  // 로그인
  @Post('/login')
  @ApiResponse({ status: 201, description: '로그인되었습니다.' })
  @ApiResponse({
    status: 404,
    description: '가입되지 않은 계정입니다.',
  })
  @ApiResponse({
    status: 400,
    description: '비밀번호가 틀렸습니다.',
  })
  async logIn(@Body() userLogInDto: UserLogInDto) {
    return this.authService.logIn(userLogInDto);
  }

  @Get('/nickname/availability')
  @ApiQuery({
    name: 'nickname',
    required: true,
    description: '중복 확인할 닉네임',
  })
  @ApiResponse({ status: 200, description: '가입 가능한 닉네임입니다.' })
  @ApiResponse({ status: 400, description: '이미 존재하는 닉네임입니다.' })
  async isNicknameAvailable(@Query('nickname') nickname: string) {
    return await this.authService.IsNicknameAvailable(nickname);
  }
}
