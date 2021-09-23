import { UserService } from './../user/user.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.getUserByUsername(username);

    if (!user) {
      //do sth
    } else if (user.password === password) {
      delete user.password;

      return user;
    }

    return null;
  }
}
