import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from 'src/model/entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  get(): string {
    return 'User entry point';
  }

  @Get('all')
  getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @Get('create/:name')
  createUser(@Param('name') name): Promise<User> {
    return this.userService.createUser(name);
  }
}
