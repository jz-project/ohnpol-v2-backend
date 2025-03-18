import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

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
  @ApiResponse({ status: 201, description: '좋아요를 성공적으로 눌렀습니다.' })
  @ApiResponse({
    status: 400,
    description: '이미 좋아요를 누른 게시물입니다.',
  })
  @ApiResponse({
    status: 404,
    description: '유효하지 않은 회원/포스트 정보입니다.',
  })
  async setLike(
    @Request() req: { user: { sub: number } },
    @Param('postId') postId: number
  ) {
    const userId: number = req.user.sub;

    // Service 호출 및 응답 반환
    await this.userService.setLike(userId, postId);
    return {
      statusCode: 201,
      message: '좋아요가 성공적으로 추가되었습니다.',
    };
  }

  @Delete('/like/:postId')
  @ApiResponse({
    status: 204,
    description: '좋아요를 성공적으로 해제했습니다.',
  })
  @ApiResponse({
    status: 400,
    description: '이미 좋아요가 해제된 상태입니다.',
  })
  @ApiResponse({
    status: 404,
    description: '유효하지 않은 회원/포스트 정보입니다.',
  })
  async deleteLike(
    @Request() req: { user: { sub: number } },
    @Param('postId') postId: number
  ) {
    const userId: number = req.user.sub;

    await this.userService.deleteLike(userId, postId);
    return {
      statusCode: 204,
    };
  }

  @Post('/favorite/:artistId')
  @ApiResponse({
    status: 201,
    description: '즐겨찾기를 성공적으로 눌렀습니다.',
  })
  @ApiResponse({
    status: 400,
    description: '이미 즐겨찾기를 누른 아티스트입니다.',
  })
  @ApiResponse({
    status: 404,
    description: '유효하지 않은 회원/아티스트 정보입니다.',
  })
  async setFavorite(
    @Request() req: { user: { sub: number } },
    @Param('artistId') artistId: number
  ) {
    const userId: number = req.user.sub;

    // Service 호출 및 응답 반환
    await this.userService.setFavorite(userId, artistId);
    return {
      statusCode: 201,
      message: '좋아요가 성공적으로 추가되었습니다.',
    };
  }
}
