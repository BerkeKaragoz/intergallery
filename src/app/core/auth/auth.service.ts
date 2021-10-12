import { UserEntity, UserIdentification } from './../user/user.entity';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, concat, Observable, Subject } from 'rxjs';
import URL from '../consts/url';
import { map, shareReplay, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly user$ = new BehaviorSubject<UserEntity | null>(null);

  readonly fetchUser$ = this.http.get<UserEntity>(URL.GETUSER, {
    withCredentials: true,
  });

  constructor(private http: HttpClient) {
    this.fetchUser();
  }

  registerUser(user: any) {
    const $ = this.http.post<UserEntity>(URL.REGISTER, user, {
      withCredentials: true,
    });

    $.subscribe((data) => {
      this.user$.next(data);
    });

    return $;
  }

  loginUser(user: any) {
    const $ = this.http.post<UserEntity>(URL.LOGIN, user, {
      withCredentials: true,
    });

    $.subscribe((data) => {
      this.user$.next(data);
    });

    return $;
  }

  isLoggedIn() {
    return !!this.user$.getValue()?.id;
  }

  fetchUser() {
    this.fetchUser$.subscribe((data) => {
      this.user$.next(data);
    });

    return this.fetchUser$;
  }
}
