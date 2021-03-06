import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { MatToolbarModule } from '@angular/material/toolbar';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FeedComponent } from './feed/feed.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SidenavComponent } from './sidenav/sidenav.component';
import { MatListModule } from '@angular/material/list';
import { ChallengeEditorComponent } from './challenge-editor/challenge-editor.component';
import { NewPersonalChallengeComponent } from './new-personal-challenge/new-personal-challenge.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { StaticSidebarComponent } from './layouts/static-sidebar/static-sidebar.component';
import { MovingSidebarComponent } from './layouts/moving-sidebar/moving-sidebar.component';
import { ShowComponent } from './show/show.component';
import { MatTabsModule } from '@angular/material/tabs';
import { PostEditorComponent } from './post-editor/post-editor.component';
import { EventDirective } from './event-components/event.directive';
import { PostCreatedComponent } from './event-components/post-created/post-created.component';
import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { ProfileComponent } from './profile-components/profile/profile.component';
import { NotFoundComponent } from './not-found/not-found.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    SignupComponent,
    FeedComponent,
    SidenavComponent,
    ChallengeEditorComponent,
    NewPersonalChallengeComponent,
    StaticSidebarComponent,
    MovingSidebarComponent,
    ShowComponent,
    PostEditorComponent,
    EventDirective,
    PostCreatedComponent,
    TimeAgoPipe,
    ProfileComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatStepperModule,
    MatIconModule,
    MatMenuModule,
    MatSnackBarModule,
    MatSidenavModule,
    MatListModule,
    MatSlideToggleModule,
    MatTabsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
