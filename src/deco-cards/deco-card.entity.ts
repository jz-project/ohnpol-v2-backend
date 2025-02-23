import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';

export class decoCard {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  decoCard: string;

  @Column()
  savedDatetime: Date;

  @CreateDateColumn()
  createdAt: Timestamp;

  @UpdateDateColumn()
  updatedAt: Timestamp;
}
