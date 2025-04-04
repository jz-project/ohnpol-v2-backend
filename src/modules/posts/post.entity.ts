import { User } from 'src/modules/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';
import { DecoCard } from '../deco-cards/deco-card.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp' })
  postedDatetime: Date;

  @CreateDateColumn()
  createdAt: Timestamp;

  @UpdateDateColumn()
  updatedAt: Timestamp;

  @ManyToMany(() => User, (user) => user.likedPosts)
  likedBy: User[];

  @OneToOne(() => DecoCard, (decoCard) => decoCard.post)
  decoCard: DecoCard;
}
