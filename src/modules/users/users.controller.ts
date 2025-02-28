import {
  Controller,
  Get,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiResponse } from 'node_modules/@nestjs/swagger';

//@ApiTags('users')
@Controller('users')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('/profile')
  @ApiResponse({ status: 200, description: '프로필을 조회합니다.' })
  @ApiResponse({
    status: 401,
    description: '유효하지 않은 회원 정보입니다.',
  })
  async getProfile(@Request() req: { user: { sub: number } }) {
    const userId: number = req.user.sub;
    if (!userId) {
      throw new UnauthorizedException('JWT payload에 사용자 ID가 없습니다.');
    }
    return this.userService.getProfile(userId);
  }
}
