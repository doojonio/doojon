import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { MatSidenav } from '@angular/material/sidenav';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { AuthService } from '../user-services/auth.service';
import { IdService, IdStatus } from '../user-services/id.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  userStatus?: IdStatus;
  username?: string;
  @Input()
  sidenav?: MatSidenav;
  @Output()
  toggleStaticSidenav = new EventEmitter();

  private _uinfoSubs?: Subscription;

  constructor(
    private _id: IdService,
    private _auth: AuthService,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
  ) {
    const logoUrl = sanitizer.bypassSecurityTrustResourceUrl('/assets/logo.svg');
    iconRegistry.addSvgIcon('logo', logoUrl);
  }

  ngOnInit(): void {
    this._uinfoSubs = this._id.getUserInfo().subscribe(uinfo => {
      if (uinfo === undefined) return;
      this.userStatus = uinfo.status;
      this.username = uinfo.profile?.username;
    });
  }

  ngOnDestroy() {
    this._uinfoSubs?.unsubscribe();
  }

  logout() {
    this._auth.logout().subscribe(_ => 1);
  }

  toggleSidenav() {
    if (this.sidenav) {
      this.sidenav?.toggle();
      return;
    }

    this.toggleStaticSidenav.emit();
  }
}
