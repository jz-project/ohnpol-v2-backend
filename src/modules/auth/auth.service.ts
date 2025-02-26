import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserRegisterDto } from '../users/dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService
  ) {}

  // 사용자 회원가입
  async register(register: UserRegisterDto) {
    const { email, nickname, password } = register;

    // 이미 가입했는지 여부 확인(email)
    const hasEmail = await this.usersRepository.findOne({
      where: { email },
    });
    if (hasEmail) {
      throw new HttpException(
        { success: false, error: '이미 가입되어 있습니다.' },
        HttpStatus.BAD_REQUEST
      );
    }

    //닉네임이 고유한지 확인
    const hasAccount = await this.usersRepository.findOne({
      where: { nickname },
    });
    if (hasAccount) {
      throw new HttpException(
        { success: false, error: '이미 사용 중인 닉네임입니다.' },
        HttpStatus.BAD_REQUEST
      );
    }

    // 비밀번호 제약 조건
    // 1.
    // 2.

    // 비밀번호 암호화
    const saltRounds = 11;

    try {
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);

      // 사용자 데이터 추가
      const newUser = this.usersRepository.create({
        nickname: nickname,
        email: email,
        password: hashedPassword,
      });

      await this.usersRepository.save(newUser);
    } catch (err) {
      console.error(err);
    }
  }
}
