import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
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

  private _user = new Observable<User>();

  constructor(private http: HttpClient) {
    this._user = this.fetchUser();
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error
      );
    }
    // Return an observable with a user-facing error message.
    return throwError('Something bad happened; please try again later.');
  }

  registerUser(user: any) {
    return this.http.post<any>(this._registerUrl, user, {
      withCredentials: true,
    });
  }

  loginUser(user: any) {
    return this.http.post<any>(this._loginUrl, user, { withCredentials: true });
  }

  isLoggedIn() {
    return this._user;
  }

  fetchUser() {
    this._user = this.http
      .get<User>(this._getUserUrl, {
        withCredentials: true,
      })
      .pipe(retry(3), catchError(this.handleError));

    return this._user;
  }

  getUser() {
    return this._user;
  }
}
