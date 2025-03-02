import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { UserProfileDto } from './dto/user.dto';
import { Post } from '../posts/post.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Post)
    private postsRepository: Repository<Post>
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

    return {
      userId: user.id,
      postId: post.id,
    };
  }
}
