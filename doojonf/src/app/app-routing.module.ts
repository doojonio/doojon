import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeedComponent } from './feed/feed.component';
import { MovingSidebarComponent } from './layouts/moving-sidebar/moving-sidebar.component';
import { StaticSidebarComponent } from './layouts/static-sidebar/static-sidebar.component';
import { LoginComponent } from './login/login.component';
import { NewPersonalChallengeComponent } from './new-personal-challenge/new-personal-challenge.component';
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
      }
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
