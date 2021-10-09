import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from './toolbar/toolbar.component';

import { AppRoutingModule } from '../app-routing.module';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

/**
 * Doojon toolbar module
 */
@NgModule({
  declarations: [
    ToolbarComponent
  ],
  imports: [
    CommonModule,

    AppRoutingModule,
    /**
     * Material imports
     */
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
  ],
  exports: [
    ToolbarComponent
  ]
})
export class ToolbarModule { }
