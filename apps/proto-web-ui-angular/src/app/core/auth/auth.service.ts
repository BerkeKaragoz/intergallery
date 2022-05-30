import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { BehaviorSubject } from "rxjs"
import { shareReplay, tap } from "rxjs/operators"
import URL from "../consts/url"
import { User, UserAuth, UserIdentification } from "./../user/user.entity"

@Injectable({
   providedIn: "root",
})
export class AuthService {
   readonly user$ = new BehaviorSubject<User | null>(null)

   readonly fetchUser$ = this.http.get<User>(URL.GETUSER, {
      withCredentials: true,
   })

   constructor(private http: HttpClient) {
      //this.fetchUser();
   }

   registerUser(user: UserAuth) {
      return this.http
         .post<User>(URL.REGISTER, user, {
            withCredentials: true,
         })
         .pipe(
            tap((data) => {
               this.user$.next(data)
            }),
            shareReplay()
         )
   }

   loginUser(user: UserAuth) {
      return this.http
         .post<User>(URL.LOGIN, user, {
            withCredentials: true,
         })
         .pipe(
            tap((data) => {
               this.user$.next(data)
            }),
            shareReplay()
         )
   }

   isLoggedIn() {
      return !!this.user$.getValue()?.id
   }

   fetchUser() {
      this.fetchUser$.subscribe((data) => {
         this.user$.next(data)
      })

      return this.fetchUser$
   }

   canActivate() {
      return this.isLoggedIn()
   }
}
