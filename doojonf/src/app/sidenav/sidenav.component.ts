import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IdService, UserInfo } from '../user-services/id.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit, OnDestroy {
  private _uinfoSubs?: Subscription;
  uinfo?: UserInfo;

  @Input()
  short = false;

  constructor(
    private _id: IdService,
  ) { }

  ngOnInit(): void {
    this._uinfoSubs = this._id.getUserInfo().subscribe(uinfo => {
      this.uinfo = uinfo;
    })
  }

  ngOnDestroy(): void {
    this._uinfoSubs?.unsubscribe()
  }

}
