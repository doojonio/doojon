import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthorizationRoutingModule } from './authorization-routing.module';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';

import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [SignupComponent, SigninComponent],
  imports: [CommonModule, AuthorizationRoutingModule, MatCardModule],
})
export class AuthorizationModule {}
