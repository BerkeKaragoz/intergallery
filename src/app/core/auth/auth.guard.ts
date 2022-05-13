import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private _authService: AuthService, private _router: Router) {}

  canActivate() {
    const canActivate = this._authService.canActivate();

    console.log('AuthGuard: ', canActivate);

    if (!canActivate) {
      //this._router.navigate(['/login']); //or wherever the login page is
    }

    return canActivate;
  }
}
