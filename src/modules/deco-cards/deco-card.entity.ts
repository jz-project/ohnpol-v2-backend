import { Post } from 'src/modules/posts/post.entity';
import { User } from 'src/modules/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class DecoCard {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  decoCard: string;

  @Column({ type: 'timestamp' })
  savedDatetime: Date;

  @CreateDateColumn()
  createdAt: Timestamp;

  @UpdateDateColumn()
  updatedAt: Timestamp;

  @OneToOne(() => Post)
  @JoinColumn()
  post: Post;

  @ManyToOne(() => User, (user) => user.id)
  user: User;
}
