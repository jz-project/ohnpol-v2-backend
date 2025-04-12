import { Controller, Param, Post, Request, UseGuards } from '@nestjs/common';
import { DecoCardsService } from './deco-cards.service';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';

@Controller('deco-cards')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard)
export class DecoCardsController {
  constructor(private decoCardsService: DecoCardsService) {}

  @Post('/:photocard-id')
  @ApiResponse({ status: 201, description: '저장되었습니다.' })
  @ApiResponse({
    status: 404,
    description: '사용자를 찾을 수 없습니다.',
  })
  @ApiResponse({
    status: 400,
    description: '포토카드를 찾을 수 없습니다.',
  })
  async registerDecoCard(
    @Request() req: { user: { sub: number } },
    @Param('photoCardId') photoCardId: number
  ) {
    const userId: number = req.user.sub;
    return this.decoCardsService.registerDecoCard(userId, photoCardId);
  }
}
