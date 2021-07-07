import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigService, DoojonApiConfig } from '../config.service';

@Injectable({
  providedIn: 'root'
})
export class ChallengesService {
  private _api: DoojonApiConfig;

  constructor(
    private _http: HttpClient,
    _config: ConfigService
  ) {
    this._api = _config.getDoojonApiConfig();
  }

  createChallenge(challenge: CreatableChallenge) : Observable<ChallengeCreateReturning[]> {
    const url = this._api.endpoint + '/resource/challenges';
    return this._http.post<ChallengeCreateReturning[]>(url, challenge)
  }

  readChallenge(id: string): Observable<ReadableChallenge> {
    const url = this._api.endpoint + '/resource/challenges';
    return this._http.get<ReadableChallenge[]>(url, {params: {id: id}}).pipe(
      map(challenges => challenges[0])
    );
  }

  getChallengeCommonInfo(id: string): Observable<ChallengeCommonInformation> {
    const url = this._api.endpoint + '/resource/challenges/common';
    return this._http.get<ChallengeCommonInformation>(url, {params: {id: id}});
  }
}

export interface ChallengeCommonInformation {
  id: string,
  title: string,
  description: string,
  proposed_by_username: string,
  in_favorite?: boolean,
}

export interface ReadableChallenge {
  id: string,
  title: string,
  description: string,
  personal_tag?: string,
  public_tag?: string,
  is_public: boolean,
  is_hidden: boolean,
  create_time: string,
  update_time?: string,
  proposed_by: string,
}

export interface CreatableChallenge {
  title: string,
  description: string,
  is_hidden: string,
}

export interface ChallengeCreateReturning {
  id: string,
}
