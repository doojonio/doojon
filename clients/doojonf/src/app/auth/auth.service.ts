import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../app-services/config.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'any',
})
export class AuthorizationService {
  constructor(private _http: HttpClient, private _config: ConfigService) {}

  signUp(form: SignUpForm) {
    const authApiConfig = this._config.getAuthApiConfig();
    const endpoint = authApiConfig.endpointV1 + '/signup';

    return this._http.post<SignUpResponse>(endpoint, form).pipe(
      map(response => response.profileId)
    );
  }
}

export interface SignUpForm {
  username: string;
  email: string;
  password: string;
}

export interface SignUpResponse {
  kind: 'SignUpResponse',
  profileId: string,
}
