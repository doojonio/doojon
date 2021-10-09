import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatSidenavModule } from '@angular/material/sidenav';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    /**
     * Angular builtin imports
     */
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,

    /**
     * Material imports
     */
    MatSidenavModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
