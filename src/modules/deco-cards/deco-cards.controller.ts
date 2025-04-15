import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { DecoCardsService } from './deco-cards.service';
import { ApiBearerAuth, ApiParam, ApiResponse } from '@nestjs/swagger';
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

  @Delete('/:decocardId')
  @HttpCode(204)
  @ApiParam({
    name: 'decocardId',
    required: true,
    description: '도안 ID',
    type: Number,
  })
  @ApiResponse({ status: 204, description: '도안을 삭제했습니다.' })
  @ApiResponse({
    status: 404,
    description: '도안을 삭제할 수 없습니다.',
  })
  async deleteDecoCard(
    @Request() req: { user: { sub: number } },
    @Param('decocardId') decoCardIdStr: string // <- string으로 받아서 직접 파싱
  ) {
    const userId: number = req.user.sub;
    const decoCardId = Number(decoCardIdStr);

    console.log('Raw param:', decoCardIdStr); // ✅ 디버깅용
    console.log('Parsed ID:', decoCardId); // ✅ 디버깅용

    if (!decoCardId || isNaN(decoCardId)) {
      throw new BadRequestException('잘못된 decoCardId입니다.');
    }

    await this.decoCardsService.deleteDecoCard(userId, decoCardId);
  }
}
