import { Artist } from 'src/modules/artists/artist.entity';
import { DecoCard } from 'src/modules/deco-cards/deco-card.entity';
import { PhotoCard } from 'src/modules/photo-cards/photo-card.entity';
import { Post } from 'src/modules/posts/post.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  nickname: string;

  @Column()
  password: string;

  @Column()
  avatar: string;

  @Column({ type: 'text' })
  biography: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => PhotoCard, (photoCard) => photoCard.id)
  photoCards: PhotoCard[];

  @OneToMany(() => DecoCard, (decoCard) => decoCard.id)
  decoCards: DecoCard[];

  @ManyToMany(() => Post)
  @JoinTable({
    name: 'likes', // 중간 테이블 이름
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'post_id',
      referencedColumnName: 'id',
    },
  })
  likedPosts: Post[];

  @ManyToMany(() => Artist)
  @JoinTable({
    name: 'favorites', // 중간 테이블 이름
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'artist_id',
      referencedColumnName: 'id',
    },
  })
  favoriteArtists: Artist[];
}
