import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from 'node_modules/@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { ArtistsService } from './artists.service';

@Controller('artists')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard)
export class ArtistsController {
  constructor(private readonly artistService: ArtistsService) {}

  @Get('/favorite-artists')
  @ApiResponse({ status: 200, description: '즐겨찾기한 아티스트 정보 조회' })
  //@ApiResponse({ status: 404, description: '즐겨찾기한 아티스트 없음' })
  async favoriteArtist(@Request() req: { user: { sub: number } }) {
    const userId: number = req.user.sub;

    return {
      statusCode: 200,
      message: '즐겨찾기한 아티스트 조회',
      result: await this.artistService.getFavoriteArtistsInfo(userId),
    };
  }
}
