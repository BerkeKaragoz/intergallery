import { AuthService } from "./auth.service"
import { Injectable } from "@angular/core"
import { CanActivate, Router } from "@angular/router"

@Injectable({
   providedIn: "root",
})
export class NotAuthGuard implements CanActivate {
   constructor(private _authService: AuthService, private _router: Router) {}

   canActivate() {
      const canActivate = !this._authService.canActivate()

      console.log("NotAuthGuard: ", canActivate)

      if (!canActivate) {
         //this._router.navigate(['/']);
      }

      return canActivate
   }
}
