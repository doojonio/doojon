import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IdService, IdStatus } from '../user-services/id.service';

@Component({
  selector: 'app-new-personal-challenge',
  templateUrl: './new-personal-challenge.component.html',
  styleUrls: ['./new-personal-challenge.component.scss']
})
export class NewPersonalChallengeComponent implements OnInit, OnDestroy {
  private _uinfoSubs?: Subscription;

  constructor(
    private _id: IdService,
    private _router: Router,
  ) { }

  ngOnInit(): void {
    this._uinfoSubs = this._id.getUserInfo().subscribe(uinfo => {
      if (uinfo?.status !== IdStatus.AUTHORIZED) {
        this._router.navigate(['/login'])
      }
    });
  }

  ngOnDestroy() {
    this._uinfoSubs?.unsubscribe()
  }

}
