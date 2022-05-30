import { DefaultUrlSerializer, Router } from "@angular/router"
import { Component } from "@angular/core"
import { AuthService } from "./core/auth/auth.service"

@Component({
   selector: "app-root",
   templateUrl: "./app.component.html",
   styleUrls: ["./app.component.scss"],
})
export class AppComponent {
   title = "Intergallery"

   isLoading: boolean

   constructor(private auth: AuthService, private router: Router) {
      this.isLoading = true

      const initialRoute = {
         path: document.location.pathname,
         query: document.location.search,
      }

      this.auth.fetchUser().subscribe(
         (res) => {
            console.log("APP USER FETCH: ", res)

            this.isLoading = false

            this.router
               .navigate([initialRoute.path], {
                  preserveFragment: true,
                  queryParamsHandling: "merge",
                  replaceUrl: true,
                  queryParams: new DefaultUrlSerializer().parse(initialRoute.query)
                     .queryParams,
               })
               .then(() => {
                  console.log("Navigated to: ", initialRoute.path)
               })
         },
         (err) => {
            this.isLoading = false
            this.router.navigate(["/login"])
         },
         () => {
            this.isLoading = false
         }
      )
   }
}
