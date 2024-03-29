import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatSidenavModule } from '@angular/material/sidenav';
import { ToolbarModule } from './toolbar/toolbar.module';
import { SorrySnackBarComponent } from './app-components/sorry-snack-bar/sorry-snack-bar.component';

@NgModule({
  declarations: [AppComponent, SorrySnackBarComponent],
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

    /**
     * Doojon imports
     */
    ToolbarModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
