import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { mapTo, tap } from 'rxjs/operators';
import { ConfigService, DoojonApiConfig } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class IdService {
  private _api: DoojonApiConfig;
  private _uinfoSubject = new BehaviorSubject<UserInfo | undefined >(undefined);

  constructor(
    config: ConfigService,
    private _http: HttpClient,
  ) {
    this._api = config.getDoojonApiConfig();
  }

  getUserInfo(opts?: {forceRefresh?: Boolean}): Observable<UserInfo | undefined> {
    if (opts?.forceRefresh || this._uinfoSubject.value === undefined) {
      const url = this._api.endpoint + '/uinfo';
      this._http.get<UserInfo>(url).subscribe(uinfo => {
        this._uinfoSubject.next(uinfo)
      });
    };

    return this._uinfoSubject.asObservable();
  }

  onLogout() {
    this._uinfoSubject.next({status: IdStatus.UNAUTHORIZED});
  }
}

export interface UserInfo {
  profile?: ProfileInfo,
  account?: AccountInfo,
  status: IdStatus,
}

export interface ProfileInfo {
  username: string
}

export interface AccountInfo {
  id: string,
  email: string,
}

export enum IdStatus {
  UNAUTHORIZED = 'UNAUTHORIZED',
  NOPROFILE = 'NOPROFILE',
  AUTHORIZED = 'AUTHORIZED',
}
