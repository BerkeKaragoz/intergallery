import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../model/entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  getAllUsers(): Promise<User[]> {
    return this.usersRepository.find();
  }

  getUserById(id: string): Promise<User> {
    return this.usersRepository.findOneOrFail(id);
  }

  getUserByUsername(username: string): Promise<User> {
    return this.usersRepository.findOneOrFail({ username });
  }

  async updateUser(id: string, name: string): Promise<User> {
    const user = await this.getUserById(id);
    user.name = name;
    return this.usersRepository.save(user);
  }

  async deleteUser(id: string): Promise<User> {
    const user = await this.getUserById(id);
    return this.usersRepository.remove(user);
  }
}
