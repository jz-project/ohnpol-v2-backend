import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from 'node_modules/@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Artist } from './artist.entity';
import { Repository } from 'node_modules/typeorm';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectRepository(Artist)
    private artistsRepository: Repository<Artist>,
    @InjectRepository(User)
    private usersRepository: Repository<User>
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

  async randomEntertainmetArtist() {
    // 1. 모든 소속사 불러오기
    const companies = await this.artistsRepository
      .createQueryBuilder('artist')
      .select('DISTINCT artist.entertainmentCompany')
      .getRawMany();

    if (companies.length === 0) {
      throw new Error('등록된 소속사(아티스트)가 없습니다.');
    }

    // 2. 소속사 무작위로 선택
    const randomIndex = Math.floor(Math.random() * companies.length); // 회사 개수만큼 수를 생성
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const randomCompany = companies[randomIndex]['entertainmentCompany'];

    // 3. 선택된 소속사의 모든 아티스트 조회
    const artists = await this.artistsRepository.find({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      where: { entertainmentCompany: randomCompany },
    });

    return {
      artists: artists.map((artist) => ({
        enterComp: artist.entertainmentCompany,
        photo: artist.photo,
        groupName: artist.groupName,
      })),
    };
  }

  async artistTabPost(userId: number) {
    const artists = await this.artistsRepository
      .createQueryBuilder('artist')
      .leftJoin('artist.collections', 'collection')
      .leftJoin('collection.photoCards', 'photoCard')
      .leftJoin('photocard.decoCards', 'decoCard')
      .leftJoin('decoCard.posts', 'post')
      .where('decoCard.user_id = :userId', { userId })
      .distinct(true)
      .getMany();

    if (artists.length === 0) {
      throw new NotFoundException('유저의 포스트가 없습니다.');
    }
    return {
      artistsTabPost: artists.map((artist) => ({
        id: artist.id,
        groupName: artist.groupName,
      })),
    };
  }

  async artistTabFavorite(userId: number) {
    const artists = await this.artistsRepository
      .createQueryBuilder('artist')
      .leftJoin('artist.favoritedBy', 'user') // artist -> user 관계 조인
      .where('user_id = :userId', { userId })
      .distinct(true)
      .getMany();

    if (artists.length === 0) {
      throw new NotFoundException('즐겨찾기가 없습니다.');
    }
    return {
      artistsTabFavorite: artists.map((artist) => ({
        groupName: artist.groupName,
      })),
    };
  }
}
