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

  createProfile(profile: CreatableProfile): Observable<ProfileCreateReturning[]> {
    const url = this._apiCfg.endpoint + '/resource/profiles';
    return this._http.post<ProfileCreateReturning[]>(url, profile);
  }
}

export interface CreatableProfile {
  username: string;
}

export interface ReadableProifle {
  id: string,
  username: string,
  create_time: string,
}

export interface ProfileCreateReturning {
  id: string;
}

