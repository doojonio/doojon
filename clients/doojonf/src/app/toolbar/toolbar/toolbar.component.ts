import { Component, Input, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  @Input()
  sidenav!: MatSidenav;

  constructor() { }

  ngOnInit(): void {
  }

  toggleSidenav() {
    this.sidenav.toggle();
  }
}
