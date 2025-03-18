import { DataSource } from 'typeorm';
import { getDataSourceOptions } from 'src/config/database.configuration';
import { ConfigService } from '@nestjs/config';
import { PhotoCard } from 'src/modules/photo-cards/photo-card.entity';

export async function insertPhotoCardData() {
  try {
    // ConfigService와 DataSource 초기화
    const configService = new ConfigService();
    const dataSource = new DataSource(getDataSourceOptions(configService));

    await dataSource.initialize(); // 데이터베이스 연결 초기화
    console.log('데이터베이스 연결 성공!');

    // Repository를 통해 데이터 삽입
    const photoCardsRepository = dataSource.getRepository(PhotoCard);

    await photoCardsRepository.insert({
      photoCard:
        'https://www.reconnectwithnature.org/getmedia/5c14303c-7704-4d13-8b0f-f54b080fe98a/Lake-vs-pond-Lake-Chaminwood-Ronald-Kapala.jpeg?width=1500&height=1000&ext=.jpeg',
      entertainmentCompany: '온폴 엔터테인먼트',
      groupName: '온폴',
      memberName: '온폴',
      collectionName: '1집',
      version: 'A1',
      activationCode:
        '34c038209ac617a52bebb1315018aae604627107908ce8a55c2bc648806160de358b79af68eaefdca228738b7ca171066b16581364d76bab1ca6d44f74ed3162296939bc4a2ae9c843040fc272cf8352d4affae1a3c2a238f94e70b5f17d8650eba138d8ba19539be0b0558acf5e77e84fd44efe575ed09793a564287b0a01d8',
      isActivated: false,
    });

    console.log('포토카드 데이터 삽입 성공!');
  } catch (error) {
    console.error('포토카드 데이터 삽입 중 오류 발생:', error);
  }
}
