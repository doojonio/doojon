import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-moving-sidebar',
  templateUrl: './moving-sidebar.component.html',
  styleUrls: ['./moving-sidebar.component.scss']
})
export class MovingSidebarComponent implements OnInit {
  title = 'Doojon';
  @ViewChild('sidenav')
  sidenav?: MatSidenav;
  _routeEventsSub?: Subscription;

  constructor(private _router: Router) {}

  ngOnInit() {
    this._routeEventsSub = this._router.events.subscribe(ev => {
      if (ev instanceof NavigationEnd) {
        this.sidenav?.close();
      }
    })
  }

  ngOnDestroy() {
    this._routeEventsSub?.unsubscribe()
  }
}
