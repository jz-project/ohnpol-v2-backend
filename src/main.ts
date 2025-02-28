import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { insertArtistData } from './dummy-data/artist.data';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('Ohnpol')
    .setDescription('API documentation for Ohnpol')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        in: 'header',
        name: 'JWT',
      },
      'access-token'
    )
    .addTag('ohnpol')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory, {
    swaggerOptions: {
      // 사전순, method순
      tagsSorter: 'alpha',
      operationsSorter: 'method',
    },
  });

  await app.listen(process.env.PORT ?? 3000);
}

async function InsertData() {
  try {
    // 데이터 삽입 함수 실행
    await insertArtistData();
    console.log('애플리케이션 실행 완료');
  } catch (error) {
    console.error('애플리케이션 실행 중 오류 발생: ', error);
  }
}

bootstrap();
InsertData();
