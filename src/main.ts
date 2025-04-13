import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
//import { insertArtistData } from './dummy-data/artist.data';
// import { insertPostData } from './dummy-data/post.data';
// import { insertPhotoCardData } from './dummy-data/photoCard.data';
// import { insertDecoCardData } from './dummy-data/decoCard.data';

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

  app.enableCors({
    origin: 'http://localhost:3000', // ← 프론트 dev 서버 주소
    credentials: true,
  });
}

// async function InsertData() {
//   try {
//     // 데이터 삽입 함수 실행
//     //await insertArtistData();
//     // await insertPostData();
//     // await insertPhotoCardData();
//     // await insertDecoCardData();

//     console.log('데이터 삽입 완료');
//   } catch (error) {
//     console.error('데이터 삽입 중 오류 발생: ', error);
//   }
// }

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
