import { DataSource } from 'typeorm';
import { getDataSourceOptions } from 'src/config/database.configuration';
import { ConfigService } from '@nestjs/config';
import { Artist } from 'src/modules/artists/artist.entity';

export async function insertArtistData() {
  try {
    // ConfigService와 DataSource 초기화
    const configService = new ConfigService();
    const dataSource = new DataSource(getDataSourceOptions(configService));

    await dataSource.initialize(); // 데이터베이스 연결 초기화
    console.log('데이터베이스 연결 성공!');

    // Repository를 통해 데이터 삽입
    const artistRepository = dataSource.getRepository(Artist);
    await artistRepository.insert({
      entertainmentCompany: '온폴 엔터테인먼트',
      groupName: '온폴',
      memberCount: 1,
      members: ['온폴'],
      photo:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSY85aaRlygmsbuqzOBazYj_c6BAqEVAZm7YQ&s',
      memberPhoto: [
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSY85aaRlygmsbuqzOBazYj_c6BAqEVAZm7YQ&s',
      ],
      collectionQuantity: 1,
    });

    console.log('데이터 삽입 성공!');
  } catch (error) {
    console.error('데이터 삽입 중 오류 발생:', error);
  }
}
