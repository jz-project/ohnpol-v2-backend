import { Column, CreateDateColumn, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from 'typeorm';

export class collection {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  photo: string;

  @Column()
  photoCardQuantity: number;

  @Column()
  activationCode: string;

  @Column({ default: false })
  isActivated: boolean;

  @CreateDateColumn()
  createdAt: Timestamp;

  @UpdateDateColumn()
  updatedAt: Timestamp;
}
