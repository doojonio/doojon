import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { IdService, UserInfo } from 'src/app/user-services/id.service';
import { ProfileCommonInfo, ProfilesService } from 'src/app/user-services/profiles.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profile?: ProfileCommonInfo;
  uinfo$: BehaviorSubject<UserInfo | undefined>;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _profiles: ProfilesService,
    _id: IdService,
  ) {
    this.uinfo$ = _id.getUserInfo()
  }

  ngOnInit(): void {
    this._route.params.subscribe(params => {
      const username = params.username;
      this._profiles.getProfileCommonInfo(username).subscribe(
        info => {console.log(info);this.profile = info},
        () => this._router.navigate([ '/404' ], {skipLocationChange: true}),
      )
    })
  }

  follow() {
    if (this.profile !== undefined)
      this._profiles.followProfile(this.profile.id).subscribe(alert, () => alert('no'));
  }

}
