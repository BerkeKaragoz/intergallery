import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthenticatedGuard } from './auth/authenticated.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { User } from './model/entities/user.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(LocalAuthGuard)
  @Get('local-auth-guard')
  testLocal(@Request() req): User {
    return req.user;
  }

  @UseGuards(AuthenticatedGuard)
  @Get('authenticated-guard')
  testAuthenticated(@Request() req): User {
    return req.user;
  }
}
