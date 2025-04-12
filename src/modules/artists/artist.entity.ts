import { Collection } from 'src/modules/collections/collection.entity';
import { User } from 'src/modules/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['groupName']) // groupName 컬럼에 고유 제약 설정
export class Artist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  entertainmentCompany: string;

  @Column()
  groupName: string;

  @Column()
  memberCount: number;

  @Column({ type: 'json' })
  members: any;

  @Column()
  photo: string;

  @Column({ type: 'json' })
  memberPhoto: any;

  @Column()
  collectionQuantity: number;

  @CreateDateColumn()
  createdAt: Timestamp;

  @UpdateDateColumn()
  updatedAt: Timestamp;

  @OneToMany(() => Collection, (collection) => collection.id)
  collection: Collection[];

  @ManyToMany(() => User, (user) => user.favoriteArtists)
  favoritedBy: User[];
}
