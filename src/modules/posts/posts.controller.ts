import {
  Controller,
  Get,
  UseGuards,
  Request,
  Post,
  Param,
} from '@nestjs/common';
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

  @Get('/now5')
  @ApiResponse({ status: 200, description: 'now 5 목록을 조회합니다.' })
  @ApiResponse({
    status: 404,
    description: 'now 5 목록을 조회할 수 없습니다.',
  })
  async getNow5(@Request() req: { user: { sub: number } }) {
    const userId: number = req.user.sub;
    await this.postService.getNow5(userId);
    return {
      statusCod: 200,
      message: 'now5 목록을 조회합니다.',
    };
  }

  @Post('/:decocard-id')
  @ApiResponse({ status: 201, description: '도안 게시를 완료합니다.' })
  @ApiResponse({
    status: 400,
    description: '도안을 게시할 수 없습니다.',
  })
  async setPost(
    @Request() req: { user: { sub: number } },
    @Param('decoCardId') decoCardId: number
  ) {
    const userId: number = req.user.sub;

    await this.postService.setPost(userId, decoCardId);
    return {
      status: 201,
      message: '도안 게시를 완료합니다.',
    };
  }
}
