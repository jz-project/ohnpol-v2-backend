import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Artist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  entertainmentCompany: string;

  @Column()
  groupName: string;

  @Column()
  memberCount: number;

  @Column()
  members: string[];

  @Column()
  photo: string;

  @Column()
  memberPhoto: JSON;

  @Column()
  collectionQuantity: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
