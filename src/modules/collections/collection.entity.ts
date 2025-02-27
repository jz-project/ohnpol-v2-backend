import { Artist } from 'src/modules/artists/artist.entity';
import { PhotoCard } from 'src/modules/photo-cards/photo-card.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Collection {
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

  @ManyToOne(() => Artist, (artist) => artist.id)
  artist: Artist;

  @ManyToOne(() => PhotoCard, (photoCard) => photoCard.collectionName)
  photoCard: PhotoCard;
}
