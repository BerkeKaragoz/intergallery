import { UsernameValidationPipe } from './pipes/usernameValidation.pipe';
import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  UsePipes,
} from '@nestjs/common';
import { User } from 'src/model/entities/user.entity';
import { LocalRegisterGuard } from './local-register.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get()
  hello(): string {
    return 'Auth entry point.';
  }

  @UseGuards(LocalRegisterGuard)
  @Post('login')
  login(@Request() req): User {
    return req.user;
  }

  @UsePipes(UsernameValidationPipe)
  @Post('register')
  register(
    @Body('username') username,
    @Body('password') password,
  ): Promise<User> {
    return this.authService.register(username, password);
  }
}
