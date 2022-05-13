import { UserEntity } from 'src/model/entities/user.entity';
import { AuthService } from './auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { ValidateUserDto } from './dto/validate-user.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, passwordInput: string): Promise<UserEntity> {
    const validateUserDto: ValidateUserDto = {
      username,
      password: passwordInput,
    };

    const user = await this.authService.validateUser(validateUserDto);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
