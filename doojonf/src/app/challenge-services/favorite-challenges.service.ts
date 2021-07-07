import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService, DoojonApiConfig } from '../config.service';

@Injectable({
  providedIn: 'root'
})
export class FavoriteChallengesService {
  private _api: DoojonApiConfig;

  constructor(
    _config: ConfigService,
    private _http: HttpClient,
  ) {
    this._api = _config.getDoojonApiConfig();
  }

  setFavoriteFlagOnChallenge(flag: boolean, challengeId: string) {
    const url = this._api.endpoint + '/resource/profile_favorite_challenges';

    if (flag === false) {
      return this._http.delete(url, {params: {challenge_id: challengeId}})
    }
    else {
      return this._http.post(url, {challenge_id: challengeId})
    }
  }
}
