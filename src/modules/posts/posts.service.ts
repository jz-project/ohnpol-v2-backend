import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { DataSource } from 'typeorm';
import { DecoCard } from '../deco-cards/deco-card.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(DecoCard)
    private decoCardsRepository: Repository<DecoCard>,
    private dataSource: DataSource
  ) {}

  async getHot10(userId: number) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    /*
    Likes 테이블: user_id, post_id를 갖는 다대다 테이블

    Posts → DecoCard (1:1)

    DecoCard → PhotoCard (N:1)

    PhotoCard → Artist (N:1)

    Posts → User (N:1)
    */

    type HotPostRaw = {
      postId: number;
      likeCount: number;
      decoCard: string;
      groupName: string;
      enterComp: string;
      memberCount: number;
      memberName: string;
      collectionName: string;
      userId: number;
      nickname: string;
    };

    const rawData: HotPostRaw[] = await this.dataSource.query(`
      SELECT 
        l.post_id AS postId,
        COUNT(*) AS likeCount,
        d.decoCard AS decoCard,
        a.entertainmentCompany AS enterComp,
        a.groupName AS groupName,
        pc.memberName AS memberName,
        a.memberCount AS memberCount,
        pc.collectionName AS collectionName,
        u.id AS userId,
        u.nickname AS nickname
      FROM likes l
      INNER JOIN post p ON p.id = l.post_id
      INNER JOIN deco_card d ON d.postId = p.id
      INNER JOIN photo_card pc ON d.photoCardId = pc.id
      INNER JOIN artist a ON pc.groupName = a.groupName
      INNER JOIN user u ON l.user_id = u.id
      GROUP BY l.post_id
      ORDER BY likeCount DESC
      LIMIT 10;
    `);

    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    return {
      'hot-10-list': rawData.map((row) => ({
        postId: row.postId,
        likeQuant: row.likeCount,
        decoCard: row.decoCard,
        enterComp: row.enterComp,
        groupName: row.groupName,
        memberName: row.memberName,
        collectionName: row.collectionName,
        userId: row.userId,
        nickname: row.nickname,
      })),
    };
  }

  async getNow5(userId: number) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('유저를 찾을 수 없습니다.');
    }

    type now5Raw = {
      id: number;
      decoCard: string;
    };

    const now5: now5Raw[] = await this.dataSource.query(`
      SELECT 
        p.id, 
        d.decoCard
      FROM post p
      INNER JOIN deco_card d ON d.postId = p.id
      ORDER BY postedDatetime DESC
      LIMIT 5
      `);

    return {
      'now-5-list': now5.map((row) => ({
        postId: row.id,
        photo: row.decoCard,
      })),
    };
  }

  async setPost(userId: number, decoCardId: number) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    const decoCard = await this.decoCardsRepository.findOne({
      where: { id: decoCardId },
    });

    if (!user) {
      throw new Error('유저를 찾을 수 없습니다.');
    }
    if (!decoCard) {
      throw new Error('도안을 찾을 수 없습니다.');
    }

    const post = this.postsRepository.create({
      postedDatetime: new Date(),
      decoCard: decoCard,
    });

    return await this.postsRepository.save(post);
  }
}
