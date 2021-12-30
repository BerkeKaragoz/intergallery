import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AuthComponent } from './pages/auth/auth.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotAuthGuard } from './core/auth/not-auth.guard';

const routes: Routes = [
  {
    path: 'login',
    pathMatch: 'full',
    canActivate: [NotAuthGuard],
    component: AuthComponent,
  },
  {
    path: 'register',
    pathMatch: 'full',
    canActivate: [NotAuthGuard],
    component: AuthComponent,
  },
  // App component handles these
  // {
  //   path: '',
  //   pathMatch: 'full',
  //   redirectTo: 'login',
  // },
  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
