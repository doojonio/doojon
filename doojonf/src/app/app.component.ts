import { createUrlResolverWithoutPackagePrefix } from '@angular/compiler';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
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
