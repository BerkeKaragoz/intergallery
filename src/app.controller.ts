import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { User } from './model/entities/user.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('user/create/:name')
  createUser(@Param('name') name): Promise<User> {
    return this.appService.createUser(name);
  }
}
