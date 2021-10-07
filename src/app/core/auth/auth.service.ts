import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Observer, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

type User = {
  id: string;
  username: string;
  name: string | null;
  creationDate: string;
} | null;

//TODO tbm proper
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _baseUrl = 'http://localhost:3000';
  private readonly _registerUrl = this._baseUrl + '/auth/register';
  private readonly _loginUrl = this._baseUrl + '/auth/login';
  private readonly _getUserUrl = this._baseUrl + '/user/get';

  private _user$ = new Observable<User>();

  constructor(private http: HttpClient) {
    this.fetchUser();
  }

  registerUser(user: any) {
    return this.http.post<any>(this._registerUrl, user, {
      withCredentials: true,
    });
  }

  loginUser(user: any) {
    this._user$ = this.http.post<any>(this._loginUrl, user, {
      withCredentials: true,
    });
    return this._user$;
  }

  isLoggedIn() {
    //TODO
    return this._user$;
  }

  fetchUser() {
    this._user$ = this.http.get<User>(this._getUserUrl, {
      withCredentials: true,
    });

    return this._user$;
  }

  getUser$() {
    return this._user$;
  }
}
