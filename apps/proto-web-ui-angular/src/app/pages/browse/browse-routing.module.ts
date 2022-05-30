import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"
import { BrowseComponent } from "./browse.component"

const routes: Routes = [{ path: "browse", component: BrowseComponent }]

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule],
})
export class BrowseRoutingModule {}
