import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from 'node_modules/@nestjs/typeorm';
import { PhotoCard } from '../photo-cards/photo-card.entity';
import { User } from '../users/user.entity';
import { Repository } from 'node_modules/typeorm';
import { DecoCard } from './deco-card.entity';
//import { Artist } from '../artists/artist.entity';
//import { BlobServiceClient } from '@azure/storage-blob';

@Injectable()
export class DecoCardsService {
  // private blobServiceClient = BlobServiceClient.fromConnectionString(
  //   process.env.AZURE_STORAGE_CONNECTION_STRING,
  // );
  // private containerName = 'decocards';

  constructor(
    @InjectRepository(DecoCard)
    private decoCardsRepository: Repository<DecoCard>,
    @InjectRepository(PhotoCard)
    private photoCardsRepository: Repository<PhotoCard>,
    @InjectRepository(User)
    private usersRepository: Repository<User>
    // @InjectRepository(Artist)
    // private artistsRepository: Repository<Artist>,
    // private dataSource: DataSource
  ) {}

  async registerDecoCard(
    userId: number,
    photoCardId: number
    // file: Express.Multer.File
  ): Promise<DecoCard> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    const photoCard = await this.photoCardsRepository.findOne({
      where: { id: photoCardId },
    });

    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    if (!photoCard) {
      throw new Error('포토카드를 찾을 수 없습니다.');
    }

    // Azure Blob Storage에 업로드
    // const blobName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    // const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
    // const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // await blockBlobClient.uploadData(file.buffer, {
    //   blobHTTPHeaders: { blobContentType: file.mimetype },
    // });

    // const imageUrl = blockBlobClient.url;

    const decoCard = this.decoCardsRepository.create({
      photoCard: photoCard,
      decoCard:
        'https://baynature.org/wp-content/uploads/2024/01/beaver-web.jpg',
      savedDatetime: new Date(),
      user: user,
    });

    return await this.decoCardsRepository.save(decoCard);
  }

  async deleteDecoCard(userId: number, decoCardId: number) {
    const decoCard = await this.decoCardsRepository.findOne({
      where: { id: decoCardId },
    });

    if (!decoCard) {
      throw new NotFoundException('도안을 찾을 수 없습니다.');
    }

    await this.decoCardsRepository.delete(decoCardId);
  }
}
