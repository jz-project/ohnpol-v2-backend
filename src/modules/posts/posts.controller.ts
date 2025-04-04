import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { PostsService } from './posts.service';

@Controller('posts')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard)
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Get('/hot10')
  @ApiResponse({ status: 200, description: 'hot 10 목록을 조회합니다.' })
  @ApiResponse({
    status: 400,
    description: 'hot 10 목록을 조회할 수 없습니다.',
  })
  async getHot10(@Request() req: { user: { sub: number } }) {
    const userId: number = req.user.sub;
    await this.postService.getHot10(userId);
    return {
      statusCode: 200,
      message: 'hot 10 목록을 조회합니다.',
    };
  }
}
