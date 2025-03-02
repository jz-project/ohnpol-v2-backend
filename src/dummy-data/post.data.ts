import { DataSource } from 'typeorm';
import { getDataSourceOptions } from 'src/config/database.configuration';
import { ConfigService } from '@nestjs/config';
import { Post } from 'src/modules/posts/post.entity';

export async function insertPostData() {
  try {
    // ConfigService와 DataSource 초기화
    const configService = new ConfigService();
    const dataSource = new DataSource(getDataSourceOptions(configService));

    await dataSource.initialize(); // 데이터베이스 연결 초기화
    console.log('데이터베이스 연결 성공!');

    // Repository를 통해 데이터 삽입
    const postsRepository = dataSource.getRepository(Post);
    const postedDatetime = new Date()
      .toISOString()
      .slice(0, 19)
      .replace('T', ' ');
    await postsRepository.insert({
      postedDatetime: postedDatetime,
    });

    console.log('포스트 데이터 삽입 성공!');
  } catch (error) {
    console.error('포스트 데이터 삽입 중 오류 발생:', error);
  }
}
