import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ConfigService, DoojonApiConfig } from '../config.service';

@Injectable({
  providedIn: 'root',
})
export class IdService {
  private _api: DoojonApiConfig;
  private _uinfoSubject = new BehaviorSubject<UserInfo | undefined>(undefined);
  private _getUserInfoRequestInProgress = false;

  constructor(config: ConfigService, private _http: HttpClient) {
    this._api = config.getDoojonApiConfig();
  }

  getUserInfo(opts?: {
    forceRefresh?: Boolean;
  }): BehaviorSubject<UserInfo | undefined> {
    const needRequest =
      !this._getUserInfoRequestInProgress &&
      (opts?.forceRefresh || this._uinfoSubject.value === undefined);

    if (needRequest) {
      this._getUserInfoRequestInProgress = true;
      const url = this._api.endpoint + '/uinfo';
      this._http.get<UserInfo>(url).subscribe(uinfo => {
        this._getUserInfoRequestInProgress = false;
        this._uinfoSubject.next(uinfo);
      });
    }

    return this._uinfoSubject;
  }

  onLogout() {
    this._uinfoSubject.next({ status: IdStatus.UNAUTHORIZED });
  }
}

export interface UserInfo {
  profile?: ProfileInfo;
  account?: AccountInfo;
  status: IdStatus;
}

export interface ProfileInfo {
  username: string;
}

export interface AccountInfo {
  id: string;
  email: string;
}

export enum IdStatus {
  UNAUTHORIZED = 'UNAUTHORIZED',
  NOPROFILE = 'NOPROFILE',
  AUTHORIZED = 'AUTHORIZED',
}
