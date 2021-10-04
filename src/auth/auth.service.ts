import { AppSessionEntity } from './../model/entities/session.entity';
import { ValidateUserDto } from './dto/validate-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/model/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Session } from 'express-session';

const saltRounds = 12;

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    @InjectRepository(AppSessionEntity, 'session')
    private sessionsRepository: Repository<AppSessionEntity>,
  ) {}

  async validateUser(dto: ValidateUserDto): Promise<UserEntity | null> {
    const { username, password } = dto;
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.username = :username', { username })
      .addSelect('user.passwordHash')
      .getOneOrFail();

    if (!user) {
      //do sth
    } else if (await this.checkPassword(password, user.passwordHash)) {
      delete user.passwordHash; // never forget to handle it

      return user;
    }

    return null;
  }

  async hashPassword(
    plainPassword: string,
  ): Promise<{ passwordSalt: string; passwordHash: string }> {
    const enc = {
      passwordSalt: '',
      passwordHash: '',
    };

    try {
      enc.passwordSalt = await bcrypt.genSalt(saltRounds);
      enc.passwordHash = await bcrypt.hash(plainPassword, enc.passwordSalt);
    } catch (err) {
      throw err;
    }

    return enc;
  }

  async checkPassword(
    plainPassword: string,
    encryptedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, encryptedPassword);
  }

  async register(dto: CreateUserDto): Promise<UserEntity> {
    const { username, password: passwordInput } = dto;
    const { passwordHash } = await this.hashPassword(passwordInput).catch(
      (err) => {
        throw err;
      },
    );

    const newUser = this.usersRepository.create({
      username,
      passwordHash,
    });

    return this.usersRepository.save(newUser).catch((err) => {
      if (err.errno === 19) {
        throw new ConflictException(`The "${username}" username is taken.`);
      }
      console.error(username, err.driverError);
      throw new InternalServerErrorException(null, err.driverError);
    });
  }

  async getUserByUsername(username: string): Promise<UserEntity> {
    return await this.usersRepository.findOne({ username }).catch(() => {
      throw new NotFoundException();
    });
  }

  logout(
    session: Session,
    callback: (err: any) => void,
    deleteSessionFromDb = false,
  ): Session {
    if (deleteSessionFromDb) {
      this.sessionsRepository
        .delete(session.id)
        .catch((res) =>
          console.error('Could not delete session from the database: ', res),
        );
    }

    return session.destroy(callback);
  }
}
