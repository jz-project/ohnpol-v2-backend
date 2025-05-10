import {
  Controller,
  Get,
  UseGuards,
  Request,
  Post,
  Delete,
  Query,
  HttpCode,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import {
  ApiBearerAuth,
  ApiQuery,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
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

  @Post('/:decocardId')
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

  @Get('liked/:userId')
  @ApiResponse({ status: 200, description: '좋아요 누른 게시물을 조회합니다.' })
  @ApiResponse({
    status: 404,
    description: '좋아요 누른 게시물이 없습니다.',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    enum: ['oldest', 'newest', 'most_liked', 'least_liked'],
    description: '정렬 방식',
    example: 'newest',
    schema: { default: 'newest' },
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    description: '몇 번째부터 조회할지',
    example: '0',
    schema: { default: 0 },
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: '몇 개까지 조회할지',
    example: '5',
    schema: { default: 5 },
  })
  async getLikedPosts(
    @Request() req: { user: { sub: number } },
    @Query('sort')
    sort: 'oldest' | 'newest' | 'most_liked' | 'least_liked' = 'newest',
    @Query('offset') offset?: string,
    @Query('limit') limit?: string
  ) {
    const userId: number = req.user.sub;
    await this.postService.getPostsLiked(
      userId,
      sort,
      Number(offset ?? 0),
      Number(limit ?? 5)
    );
  }

  @Get('/user/:artistId')
  @HttpCode(200)
  @ApiParam({
    name: 'artistId',
    required: true,
    description: '아티스트 ID',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: '유저의 해당 아티스트의 도안을 조회합니다.',
  })
  @ApiResponse({
    status: 404,
    description: '유저의 해당 아티스트의 도안이 없습니다.',
  })
  async getPostsByArtist(
    @Request() req: { user: { sub: number } },
    @Param('artistId') artistId: number
  ) {
    const userId: number = req.user.sub;
    const result = await this.postService.postsByArtist(userId, artistId);
    return result;
  }

  @Delete('/:postId')
  @HttpCode(204)
  @ApiResponse({ status: 204, description: '포스트를 삭제했습니다.' })
  @ApiResponse({
    status: 404,
    description: '포스트를 삭제할 수 없습니다.',
  })
  async deletePost(
    @Request() req: { user: { sub: number } },
    @Param('postId') postId: number
  ) {
    const userId = req.user.sub;

    await this.postService.deletePost(userId, postId);
  }

  @Get(':artistId')
  @HttpCode(200)
  @ApiParam({
    name: 'artistId',
    required: true,
    description: '아티스트 ID',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: '해당 아티스트의 포스트를 조회합니다.',
  })
  @ApiResponse({
    status: 404,
    description: '해당 아티스트의 포스트가 없습니다.',
  })
  async artistAll(@Param('artistId') artistId: number) {
    const result = await this.postService.artistAll(artistId);
    return result;
  }

  @Get('/:memberName')
  @ApiParam({
    name: 'memberName',
    required: true,
    description: '멤버 이름',
    type: String,
  })
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: '해당 멤버의 포스트를 조회합니다.',
  })
  @ApiResponse({
    status: 404,
    description: '해당 멤버의 포스트가 없습니다.',
  })
  async memberAll(@Param('memberName') memberName: string) {
    const result = await this.postService.memberAll(memberName);
    return result;
  }
}
