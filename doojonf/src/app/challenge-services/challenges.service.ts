import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigService, DoojonApiConfig } from '../config.service';
import { ReadableProifle } from '../user-services/profiles.service';

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

  readChallengeWithLinkedInformation(id: string): Observable<ChallengeWithLinkedInformation> {
    const url = this._api.endpoint + '/resource/challenges/linked';
    return this._http.get<ChallengeWithLinkedInformation>(url, {params: {id: id}});
  }
}

export interface ChallengeWithLinkedInformation {
  challenge: ReadableChallenge,
  proposed_by: ReadableProifle,
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
