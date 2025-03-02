import {
  Controller,
  Get,
  Param,
  Post,
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

  @Post('/like/:postId')
  @ApiResponse({ status: 201, description: '좋아요를 눌렀습니다.' })
  @ApiResponse({
    status: 400,
    description: '유효하지 않은 회원/포스트 정보입니다.',
  })
  async setLike(
    @Request() req: { user: { sub: number } },
    @Param('postId') postId: number
  ) {
    const userId: number = req.user.sub;
    return this.userService.setLike(userId, postId);
  }
}
