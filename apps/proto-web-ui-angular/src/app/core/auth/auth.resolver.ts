import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { User } from '../user/user.entity';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthResolver implements Resolve<User> {
  constructor(private authService: AuthService) {}

  resolve() {
    return this.authService.fetchUser();
  }
}
