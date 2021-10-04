import { CreateUserDto } from './../user/dto/create-user.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/model/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

const saltRounds = 12;

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.username = :username', { username })
      .addSelect('user.passwordHash')
      .getOneOrFail();

    if (!user) {
      //do sth
    } else if (await this.checkPassword(password, user.passwordHash)) {
      delete user.passwordHash; //never forget

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

  async register(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { username, passwordInput } = createUserDto;
    const { passwordHash } = await this.hashPassword(passwordInput).catch(
      (err) => {
        throw err;
      },
    );

    const newUser = this.usersRepository.create({
      username,
      passwordHash,
    });

    return this.usersRepository.save(newUser);
  }

  async getUserByUsername(username: string): Promise<UserEntity> {
    return await this.usersRepository.findOne({ username });
  }
}
