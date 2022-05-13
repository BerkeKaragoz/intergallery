import { AuthenticatedGuard } from './authenticated.guard';
import { UsernameValidationPipe } from './pipe/usernameValidation.pipe';
import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Res,
  UsePipes,
  Session,
  Req,
} from '@nestjs/common';
import { UserEntity } from 'src/model/entities/user.entity';
import { LocalRegisterGuard } from './local-register.guard';
import { Request as ExpressReq, Response as ExpressRes } from 'express';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { ApiTags, ApiCreatedResponse } from '@nestjs/swagger';
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalRegisterGuard)
  @Post('login') // Creates new session
  login(@Req() req): UserEntity {
    return req.user;
  }

  @UseGuards(AuthenticatedGuard)
  @Get('logout')
  logout(
    @Session() sess,
    @Req() req: ExpressReq,
    @Res() res: ExpressRes,
  ): void {
    const referrer = req.headers.referer;

    this.authService.logout(sess, () => {
      res.cookie(process.env.SESSION_NAME || 'connect.sid', '', {
        path: '/',
        httpOnly: true,
        maxAge: 0,
        expires: new Date(0),
      });

      // Return to referrer if there is one
      if (referrer) res.redirect(referrer);

      res.end();
    });
  }

  @ApiCreatedResponse({
    description: 'User has been registered.',
    type: UserEntity,
  })
  @UsePipes(UsernameValidationPipe)
  @Post('register')
  register(@Req() req, @Body() dto: CreateUserDto): Promise<UserEntity> {
    return this.authService.register(dto).then((data) => {
      req.logIn(data, (err) => err);
      return data;
    });
  }
}
