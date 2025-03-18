import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserLogInDto, UserRegisterDto } from '../users/dto/user.dto';
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

  // 사용자 로그인
  async logIn(logIn: UserLogInDto) {
    const { email, password } = logIn;

    try {
      // 가입된 이메일인지 확인
      const user = await this.usersRepository.findOne({ where: { email } });
      if (!user) {
        throw new NotFoundException('가입되지 않은 이메일입니다.');
      }

      // 비밀번호 확인
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new BadRequestException('비밀번호가 틀렸습니다.');
      }

      const payload = { sub: user.id, email: user.email };
      console.log(`로그인 (계정: ${email})`);
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      console.error('로그인 중 오류 발생:', error);
      throw new HttpException(
        { success: false, error: '로그인 중 오류가 발생했습니다.' },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
