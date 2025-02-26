import { Module } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CollectionsController } from './collections.controller';
import { Collection } from './collection.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Collection])],
  providers: [CollectionsService],
  controllers: [CollectionsController],
})
export class CollectionsModule {}
