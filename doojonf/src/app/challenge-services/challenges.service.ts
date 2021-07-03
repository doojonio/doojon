import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

  createChallenge(challenge: CreatableChallenge) : Observable<string> {
    const url = this._api.endpoint + '/resource/challenges';
    return this._http.post(url, challenge, {responseType: 'text'})
  }
}

export interface CreatableChallenge {
  title: string,
  description: string,
  is_hidden: string,
}
