import { LocalRegisterGuard } from '../auth/local-register.guard';
import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { UserEntity } from 'src/model/entities/user.entity';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  hello(): string {
    return 'User entry point';
  }

  @UseGuards(LocalRegisterGuard)
  @Get('test')
  test(): string {
    return 'Has auth';
  }

  @UseGuards(AuthenticatedGuard)
  @Get('get')
  getUser(@Request() req): UserEntity {
    return req.user;
  }

  @UseGuards(AuthenticatedGuard)
  @Get('all')
  getAllUsers(): Promise<UserEntity[]> {
    return this.userService.getAllUsers();
  }
}
