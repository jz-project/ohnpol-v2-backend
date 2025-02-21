import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getTypeOrmConfig = (
  ConfigService: ConfigService
): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: ConfigService.get<string>('DB_HOST'),
  port: ConfigService.get<number>('DB_HOST'),
  username: ConfigService.get<string>('DB_USERNAME'),
  password: ConfigService.get<string>('DB_PASSWORD'),
  database: ConfigService.get<string>('DB_NAME'),
  entities: [],
  synchronize: true, // 개발 환경에서만 true로 설정 (배포 환경에서는 false)
});
