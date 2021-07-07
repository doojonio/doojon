import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService, DoojonApiConfig } from '../config.service';

@Injectable({
  providedIn: 'root',
})
export class ProfilesService {
  private _apiCfg: DoojonApiConfig;

  constructor(conf: ConfigService, private _http: HttpClient) {
    this._apiCfg = conf.getDoojonApiConfig();
  }

  createProfile(
    profile: CreatableProfile
  ): Observable<ProfileCreateReturning[]> {
    const url = this._apiCfg.endpoint + '/resource/profiles';
    return this._http.post<ProfileCreateReturning[]>(url, profile);
  }

  isUsernameAvailable(username: string): Observable<boolean> {
    const url =
      this._apiCfg.endpoint + '/resource/profiles/is_username_available';
    return this._http.get<boolean>(url, { params: { username } });
  }
}

export interface CreatableProfile {
  username: string;
}

export interface ReadableProifle {
  id: string;
  username: string;
  create_time: string;
}

export interface ProfileCreateReturning {
  id: string;
}
