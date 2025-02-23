import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';
import { DecoCard } from 'src/deco-cards/deco-card.entity';
import { User } from 'src/users/user.entity';
import { Collection } from 'src/collections/collection.entity';

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

  @OneToOne(() => DecoCard)
  @JoinColumn()
  decocard: DecoCard;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @OneToMany(() => Collection, (collection) => collection.name)
  collection: Collection[];
}
