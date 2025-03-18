/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { UserProfileDto } from './dto/user.dto';
import { Post } from '../posts/post.entity';
import { Artist } from '../artists/artist.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @InjectRepository(Artist)
    private artistsRepository: Repository<Artist>
  ) {}

  async getProfile(userId: number): Promise<UserProfileDto> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('유저를 찾을 수 없습니다.');
    }

    return {
      avatar: user.avatar,
      nickname: user.nickname,
      biography: user.biography,
    };
  }

  async setLike(userId: number, postId: number) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    const post = await this.postsRepository.findOne({
      where: { id: postId },
    });

    if (!post) {
      throw new Error('포스트를 찾을 수 없습니다.');
    }
    if (!user) {
      throw new Error('유저를 찾을 수 없습니다.');
    }

    // 좋아요 중복 여부 확인
    const isLiked = await this.usersRepository
      .createQueryBuilder()
      .relation(User, 'likedPosts') // User와 likedPosts 관계 명시
      .of(userId) // 특정 사용자
      .loadOne(); // 특정 게시물과의 관계를 조회

    if (isLiked) {
      throw new Error('이미 좋아요를 누른 게시물입니다.');
    }

    // 좋아요 추가
    await this.usersRepository
      .createQueryBuilder()
      .relation(User, 'likedPosts') // User와 likedPosts 관계 설정
      .of(userId) // 특정 사용자
      .add(postId); // 게시물 추가

    return { message: '좋아요가 성공적으로 추가되었습니다.' };
  }

  async deleteLike(userId: number, postId: number) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['likedPosts'], // likedPosts 관계를 로드
    });

    const post = await this.postsRepository.findOne({
      where: { id: postId },
    });

    if (!post) {
      throw new Error('포스트를 찾을 수 없습니다.');
    }
    if (!user) {
      throw new Error('유저를 찾을 수 없습니다.');
    }

    // 좋아요 관계 제거
    await this.usersRepository
      .createQueryBuilder()
      .relation(User, 'likedPosts')
      .of(userId)
      .remove(postId); // 특정 게시물 제거

    return { message: '좋아요가 성공적으로 삭제되었습니다.' };
  }

  async setFavorite(userId: number, artistId: number) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });
    const artist = await this.artistsRepository.findOne({
      where: { id: artistId },
    });

    if (!artist) {
      throw new Error('아티스트를 찾을 수 없습니다.');
    }
    if (!user) {
      throw new Error('유저를 찾을 수 없습니다.');
    }

    // 즐겨찾기 중복 여부 확인
    const isFavorite = await this.usersRepository
      .createQueryBuilder()
      .relation(User, 'favoriteArtists')
      .of(userId)
      .loadOne();

    if (isFavorite) {
      throw new Error('이미 즐겨찾기를 누른 아티스트입니다.');
    }

    // 좋아요 추가
    await this.usersRepository
      .createQueryBuilder()
      .relation(User, 'favoriteArtists')
      .of(userId)
      .add(artistId);

    return { message: '즐겨찾기가 성공적으로 추가되었습니다.' };
  }
}
