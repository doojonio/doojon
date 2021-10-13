import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../app-services/config.service';

@Injectable({
  providedIn: 'any',
})
export class AuthorizationService {
  constructor(private _http: HttpClient, private _config: ConfigService) {}

  signUp(form: SignUpForm) {
    const doojonApiConfig = this._config.getDoojonApiConfig();
    const endpoint = doojonApiConfig.endpointV1 + 'a/signup';

    return this._http.post(endpoint, form);
  }
}

export interface SignUpForm {
  username: string;
  email: string;
  password: string;
}
