import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  /**
   * Authorization module domain
   */
  {
    path: 'a',
    loadChildren: () =>
      import('./auth/auth.module').then(
        m => m.AuthorizationModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
