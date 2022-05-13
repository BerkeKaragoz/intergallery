import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthenticatedGuard } from './auth/authenticated.guard';
import { LocalRegisterGuard } from './auth/local-register.guard';
import { UserEntity } from './model/entities/user.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(LocalRegisterGuard)
  @Get('local-auth-guard')
  testLocal(@Request() req): UserEntity {
    return req.user;
  }

  @UseGuards(AuthenticatedGuard)
  @Get('authenticated-guard')
  testAuthenticated(@Request() req): UserEntity {
    return req.user;
  }
}
