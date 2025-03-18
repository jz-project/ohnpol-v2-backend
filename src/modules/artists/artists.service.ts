import { Injectable } from '@nestjs/common';
import { InjectRepository } from 'node_modules/@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Artist } from './artist.entity';
import { Repository } from 'node_modules/typeorm';
import { Post } from '../posts/post.entity';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectRepository(Artist)
    private artistsRepository: Repository<Artist>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Post)
    private postsRepository: Repository<Post>
  ) {}

  async favoriteArtists(userId: number): Promise<Artist[]> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['favoriteArtists'],
    });

    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    return user.favoriteArtists; // 좋아요 누른 아티스트 정보 반환
  }

  // 데이터를 변환하고 반환하는 함수
  async getFavoriteArtistsInfo(userId: number) {
    const artists = await this.favoriteArtists(userId); // 아티스트 데이터 가져오기

    // if (!artists) {
    //   throw new Error('즐겨찾기한 아티스트 없음');
    // }

    return artists.map((artist: Artist) => ({
      id: artist.id,
      photo: artist.photo,
      groupName: artist.groupName,
    }));
  }
}
