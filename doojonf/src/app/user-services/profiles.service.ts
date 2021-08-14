import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigService, DoojonApiConfig } from '../config.service';
import { EventId, EventType } from '../event-services/events.service';

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
  ): Observable<ProfileId[]> {
    const url = this._apiCfg.v1endpoint + '/resource/profiles';
    return this._http.post<ProfileId[]>(url, profile);
  }

  getProfileCommonInfo(username: string): Observable<ProfileCommonInfo> {
    const url = this._apiCfg.v1endpoint + '/resource/profiles/common';
    let params = new HttpParams().set('username', username);

    return this._http.get<ProfileCommonInfo>(url, {params})
  }

  followProfile(id: string): Observable<EventId> {
    const url = this._apiCfg.v1endpoint + '/resource/events';
    const event = {
      type: EventType.FOLLOWING_STARTED,
      object: id
    };

    return this._http.post<EventId>(url, event)
  }

  isUsernameAvailable(username: string): Observable<boolean> {
    const url =
      this._apiCfg.v1endpoint + '/resource/profiles/is_username_available';
    return this._http.get<boolean>(url, { params: { username } });
  }
}

export interface ProfileCommonInfo {
  id: string,
  username: string,
  followers: number,
  following: number,
  posts: number,
}

export interface CreatableProfile {
  username: string;
}

export interface ReadableProifle {
  id: string;
  username: string;
  create_time: string;
}

export interface ProfileId {
  id: string;
}
