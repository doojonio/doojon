import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-opened-sidebar',
  templateUrl: './static-sidebar.component.html',
  styleUrls: ['./static-sidebar.component.scss']
})
export class StaticSidebarComponent implements OnInit {
  shortSidenav = false;

  constructor() { }

  ngOnInit(): void {
  }

  toggleStaticSidenav() {
    this.shortSidenav = !this.shortSidenav;
  }

}
