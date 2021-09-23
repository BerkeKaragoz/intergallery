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

  getUserById(id: number): Promise<User> {
    return this.usersRepository.findOneOrFail(id);
  }

  getUserByUsername(username: string): Promise<User> {
    return this.usersRepository.findOneOrFail({ username });
  }

  createUser(name: string): Promise<User> {
    const newUser = this.usersRepository.create({ name });

    return this.usersRepository.save(newUser);
  }

  async updateUser(id: number, name: string): Promise<User> {
    const user = await this.getUserById(id);
    user.name = name;
    return this.usersRepository.save(user);
  }

  async deleteUser(id: number): Promise<User> {
    const user = await this.getUserById(id);
    return this.usersRepository.remove(user);
  }
}
