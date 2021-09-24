import { AuthService } from './auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, passwordInput: string): Promise<any> {
    const user = await this.authService.validateUser(username, passwordInput);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
