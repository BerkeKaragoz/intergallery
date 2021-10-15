import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import MediaEntity from './media.entity';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  private readonly _baseUrl = 'http://localhost:3000';
  private readonly _userMediaUrl = this._baseUrl + '/media/user';
  private readonly _createMediaUrl = this._baseUrl + '/media';

  constructor(private http: HttpClient) {}

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

  getUserMedia() {
    return this.http
      .get<Array<MediaEntity>>(this._userMediaUrl, { withCredentials: true })
      .pipe(retry(3), catchError(this.handleError));
  }

  createMedia(name: string, sources: Array<any>) {
    return this.http
      .post<MediaEntity>(
        this._createMediaUrl,
        { name, sources },
        { withCredentials: true }
      )
      .pipe(retry(3), catchError(this.handleError));
  }
}
