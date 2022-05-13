import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../model/entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  getAllUsers(): Promise<UserEntity[]> {
    return this.usersRepository.find();
  }

  getUserById(id: string): Promise<UserEntity> {
    return this.usersRepository.findOneOrFail(id);
  }

  getUserByUsername(username: string): Promise<UserEntity> {
    return this.usersRepository.findOneOrFail({ username });
  }

  async updateUser(id: string, name: string): Promise<UserEntity> {
    const user = await this.getUserById(id);
    user.name = name;
    return this.usersRepository.save(user);
  }

  async deleteUser(id: string): Promise<UserEntity> {
    const user = await this.getUserById(id);
    return this.usersRepository.remove(user);
  }
}
