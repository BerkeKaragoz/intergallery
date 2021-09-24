import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { User } from 'src/model/entities/user.entity';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get()
  hello(): string {
    return 'Auth entry point.';
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req): User {
    return req.user;
  }

  @Post('register')
  register(
    @Body('username') username,
    @Body('password') password,
  ): Promise<User> {
    return this.authService.register(username, password);
  }
}
