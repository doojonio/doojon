import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { IdService, IdStatus, UserInfo } from '../id.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  userStatus?: IdStatus;
  username?: string;

  constructor(private _id: IdService, private _auth: AuthService) {}

  ngOnInit(): void {
    this._id.getUserInfo().subscribe(uinfo => {
      if (uinfo === undefined) return;
      this.userStatus = uinfo.status;
      this.username = uinfo.profile?.username;
    });
  }

  logout() {
    this._auth.logout().subscribe(_ => 1)
  }
}
