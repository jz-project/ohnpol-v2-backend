import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
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

  @Get('/random-artists')
  @ApiResponse({ status: 200, description: '랜덤 소속사 아티스트 정보 조회' })
  //@ApiResponse({ status: 404, description: '즐겨찾기한 아티스트 없음' })
  async randomEntertainmentArtist() {
    return {
      statusCode: 200,
      message: '랜덤 소속사 아티스트 조회',
      result: await this.artistService.randomEntertainmetArtist(),
    };
  }

  @Get('/artists')
  @ApiResponse({ status: 200, description: '아티스트 정보를 조회합니다.' })
  @ApiResponse({ status: 404, description: '아티스트 정보가 없습니다.' })
  async getAllArtists() {
    return {
      statusCode: 200,
      message: '아티스트 정보를 조회합니다.',
      result: await this.artistService.allArtist(),
    };
  }

  @Get('/:artist-id/profile')
  @ApiResponse({ status: 200, description: '아티스트 정보를 조회합니다.' })
  @ApiResponse({ status: 404, description: '아티스트 정보가 없습니다.' })
  async getArtistProfile(@Param('artistId') artistId: number) {
    return {
      statusCode: 200,
      message: '아티스트 정보를 조회합니다.',
      result: await this.artistService.artistProfile(artistId),
    };
  }

  @Get('/post/artist-tab')
  @ApiResponse({ status: 200, description: '아티스트 탭 정보 조회' })
  @ApiResponse({ status: 404, description: '포스트가 없습니다.' })
  async artistTabPost(@Request() req: { user: { sub: number } }) {
    const userId: number = req.user.sub;

    return {
      statusCode: 200,
      message: '아티스트 탭 정보 조회',
      result: await this.artistService.artistTabPost(userId),
    };
  }

  @Get('/favorite/artist-tab')
  @ApiResponse({ status: 200, description: '아티스트 탭 정보 조회' })
  @ApiResponse({ status: 404, description: '즐겨찾기가 없습니다.' })
  async artistTabFavorite(@Request() req: { user: { sub: number } }) {
    const userId: number = req.user.sub;

    return {
      statusCode: 200,
      message: '아티스트 탭 정보 조회',
      result: await this.artistService.artistTabFavorite(userId),
    };
  }

  @Get('/decocard/artist-tab')
  @ApiResponse({ status: 200, description: '아티스트 탭 정보 조회' })
  @ApiResponse({ status: 404, description: '도안이 없습니다.' })
  async artistTabdecoCard(@Request() req: { user: { sub: number } }) {
    const userId: number = req.user.sub;

    return {
      statusCode: 200,
      message: '아티스트 탭 정보 조회',
      result: await this.artistService.artistTabDecoCard(userId),
    };
  }
}
