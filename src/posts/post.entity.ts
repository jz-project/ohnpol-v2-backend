import { Column, PrimaryGeneratedColumn, Timestamp } from 'typeorm';

export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  postedDatetime: Timestamp;
}
