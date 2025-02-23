import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class PhotoCard {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  photoCard: string;

  @Column()
  entertainmentCompany: string;

  @Column()
  groupName: string;

  @Column()
  memberName: string;

  @Column()
  collectionName: string;

  @Column()
  version: string;

  @Column()
  activationCode: string;

  @Column({ default: false })
  isActivated: boolean;

  @CreateDateColumn()
  createdAt: Timestamp;

  @UpdateDateColumn()
  updatedAt: Timestamp;
}
