import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeedComponent } from './feed/feed.component';
import { MovingSidebarComponent } from './layouts/moving-sidebar/moving-sidebar.component';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ProfileComponent } from './profile-components/profile/profile.component';
import { ShowComponent } from './show/show.component';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
  {
    path: '',
    component: MovingSidebarComponent,
    children: [
      {
        path: '',
        component: FeedComponent,
      },
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'signup',
        component: SignupComponent,
      },
      {
        path: 'show',
        component: ShowComponent,
      },
      {
        path: '404',
        component: NotFoundComponent,
      },
      {
        path: ':username',
        component: ProfileComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/404',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
