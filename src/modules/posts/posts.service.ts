import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { DataSource } from 'typeorm';
import { DecoCard } from '../deco-cards/deco-card.entity';
import { Artist } from '../artists/artist.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(DecoCard)
    private decoCardsRepository: Repository<DecoCard>,
    @InjectRepository(Artist)
    private artistsRepository: Repository<Artist>,
    private dataSource: DataSource
  ) {}

  // 재사용 가능한 모듈
  async getPostsInfos(postIds: number[]): Promise<
    {
      postId: number;
      postDatetime: Date;
      decoCard: string;
      enterComp: string;
      groupName: string;
      memberName: string;
      collectionName: string;
      nickname: string;
      userId: number;
      likeCount: number;
    }[]
  > {
    if (postIds.length === 0) return [];

    type rawData = {
      postId: number;
      postDatetime: Date;
      decoCard: string;
      enterComp: string;
      groupName: string;
      memberName: string;
      collectionName: string;
      nickname: string;
      userId: number;
      likeCount: number;
    };

    const result: rawData[] = await this.dataSource.query(
      `
      SELECT 
      p.id AS postId,
      p.postDatetime, 
      dc.decoCard,
      a.entertainmentCompany AS enterComp,
      a.groupName,
      pc.memberName,
      pc.collectionName,
      u.nickname,
      u.id AS userId,
      COUNT(l2.post_id) AS likeCount
    FROM post p
    INNER JOIN user u ON p.userId = u.id
    INNER JOIN deco_card dc ON dc.postId = p.id
    INNER JOIN photo_card pc ON dc.photoCardId = pc.id
    INNER JOIN artist a ON pc.photoCard = a.photoCard
    LEFT JOIN likes l2 ON l2.post_id = p.id
    WHERE p.id IN (${postIds.map(() => '?').join(',')})
    GROUP BY p.id, p.postDatetime, dc.decoCard, a.entertainmentCompany, a.groupName, pc.memberName, pc.collectionName, u.nickname
      `,
      postIds
    );

    return result.map((row) => ({
      postId: row.postId,
      postDatetime: row.postDatetime,
      decoCard: row.decoCard,
      enterComp: row.enterComp,
      groupName: row.groupName,
      memberName: row.memberName,
      collectionName: row.collectionName,
      nickname: row.nickname,
      userId: row.userId,
      likeCount: Number(row.likeCount),
    }));
  }

  async getHot10(userId: number) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    // 1. 좋아요 많은 상위 10개 postId만 조회
    const hotPostIds: { postId: number }[] = await this.dataSource.query(`
      SELECT l.post_id AS postId
      FROM likes l
      GROUP BY l.post_id
      ORDER BY COUNT(*) DESC
      LIMIT 10
    `);

    const postIds = hotPostIds.map((row) => row.postId);

    // 2. 상세 정보 가져오기 (모듈 함수 재사용)
    const postInfos = await this.getPostsInfos(postIds);

    // 3. 순서 맞추기 (likeCount 기준 내림차순 정렬)
    postInfos.sort((a, b) => b.likeCount - a.likeCount);

    return {
      'hot-10-list': postInfos.map((post) => ({
        postId: post.postId,
        likeQuant: post.likeCount,
        decoCard: post.decoCard,
        enterComp: post.enterComp,
        groupName: post.groupName,
        memberName: post.memberName,
        collectionName: post.collectionName,
        userId: post.userId, // ← 필요하다면 getPostInfos에 userId도 포함되도록 수정해야 함
        nickname: post.nickname, // ↑
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

  async getPostsLiked(
    userId: number,
    sort: 'oldest' | 'newest' | 'most_liked' | 'least_liked' = 'newest',
    offset = 0,
    limit = 5
  ) {
    // 1. 유저 존재 확인
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) throw new Error('사용자를 찾을 수 없습니다.');

    // 2. 정렬 방식 설정
    let orderBy: string;
    switch (sort) {
      case 'oldest':
        orderBy = 'p.postedDatetime ASC';
        break;
      case 'newest':
        orderBy = 'p.postedDatetime DESC';
        break;
      case 'most_liked':
      case 'least_liked':
        orderBy = 'p.postedDatetime DESC'; // 좋아요 기준 정렬은 나중에 JS에서 처리
        break;
      default:
        orderBy = 'p.postedDatetime DESC';
    }

    // 3. 사용자가 좋아요한 post의 ID만 먼저 가져오기
    const postIdRows: { postId: number }[] = await this.dataSource.query(
      `
      SELECT p.id AS postId
      FROM post p
      INNER JOIN likes l ON l.post_id = p.id
      WHERE l.user_id = ?
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?
    `,
      [userId, limit, offset]
    );

    const postsIds = postIdRows.map((row) => row.postId);

    // 4. 각 post의 상세 정보 + 좋아요 수 조회
    const postInfos = await this.getPostsInfos(postsIds);

    // 5. 좋아요 수 기준 정렬은 JS에서 처리
    if (sort === 'most_liked') {
      postInfos.sort((a, b) => b.likeCount - a.likeCount);
    } else if (sort === 'least_liked') {
      postInfos.sort((a, b) => a.likeCount - b.likeCount);
    }

    // 6. 클라이언트에 응답할 데이터
    return {
      'like-list': postInfos,
      nextOffset: offset + postInfos.length, // 다음 요청할 offset
      hasMore: postInfos.length === limit, // 더 불러올 게 있는지 여부
    };
  }

  async postsByArtist(userId: number, artistId: number) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });
    const artist = await this.artistsRepository.findOne({
      where: { id: artistId },
    });

    if (!user) {
      throw new Error('회원을 찾을 수 없습니다.');
    }
    if (!artist) {
      throw new Error('아티스트를 찾을 수 없습니다.');
    }

    // 아티스트 ID에 해당하는 포스트 ID 목록 조회
    const postIdsResult: { postId: number }[] = await this.dataSource.query(
      `
    SELECT p.id as postId
    FROM post p
    INNER JOIN deco_card dc ON dc.id = p.decoCardId
    INNER JOIN photo_card pc ON pc.id = dc.photoCardId
    INNER JOIN artist a ON pc.groupName = a.groupName
    WHERE a.id = ?
    `,
      [artistId]
    );

    const postIds = postIdsResult.map((row) => row.postId);

    if (postIds.length === 0) {
      return { 'my-post-list': [] };
    }

    // postInfos의 모든 요소가 무슨 type인지 알려줌.
    const postInfos: Awaited<ReturnType<typeof this.getPostsInfos>> =
      await this.getPostsInfos(postIds);

    return {
      'my-post-list': postInfos.map((info) => ({
        postId: info.postId,
        postDateTime: info.postDatetime,
        decoCard: info.decoCard,
        enterComp: info.enterComp,
        groupName: info.groupName,
        memberName: info.memberName,
        collectionName: info.collectionName,
        nickname: info.nickname,
        likeQuant: info.likeCount,
      })),
    };
  }
  async deletePost(userId: number, postId: number) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });
    const post = await this.postsRepository.findOne({
      where: { id: postId },
    });

    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }
    if (!post) {
      throw new Error('포스트를 찾을 수 없습니다.');
    }

    await this.postsRepository.delete(postId);

    return { message: '포스트가 성공적으로 삭제되었습니다.' };
  }
}
