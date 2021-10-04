import { AuthenticatedGuard } from './authenticated.guard';
import { UsernameValidationPipe } from './pipe/usernameValidation.pipe';
import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Res,
  UsePipes,
  Session,
} from '@nestjs/common';
import { UserEntity } from 'src/model/entities/user.entity';
import { LocalRegisterGuard } from './local-register.guard';
import { Response } from 'express';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get()
  hello(): string {
    return 'Auth entry point.';
  }

  @UseGuards(LocalRegisterGuard)
  @Post('login') // Creates new session
  login(@Request() req): UserEntity {
    return req.user;
  }

  @UseGuards(AuthenticatedGuard)
  @Get('logout')
  logout(@Session() sess, @Res() res: Response) {
    //domain:
    sess.destroy(() => {
      res.cookie('connect.sid', '', {
        path: '/',
        httpOnly: true,
        maxAge: 0,
        expires: new Date(0),
      });
      res.end();
    });
  }

  @UsePipes(UsernameValidationPipe)
  @Post('register')
  register(@Body() dto: CreateUserDto): Promise<UserEntity> {
    return this.authService.register(dto);
  }
}
