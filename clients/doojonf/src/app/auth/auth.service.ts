import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../app-services/config.service';
import { map, catchError } from 'rxjs/operators';
import { NotAuthorizedError } from '../app-api-errors';

@Injectable({
  providedIn: 'any',
})
export class AuthService {
  constructor(private _http: HttpClient, private _config: ConfigService) {}

  signIn(form: SignInForm) {
    const authApiConfig = this._config.getAuthApiConfig();
    const endpoint = authApiConfig.endpointV1 + '/signin';

    return this._http.post<SignInResponse>(endpoint, form).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          throw new NotAuthorizedError(error.message);
        }
        throw new Error(error.message);
      }),
      map(response => response.profileId),
    );
  }

  signUp(form: SignUpForm) {
    const authApiConfig = this._config.getAuthApiConfig();
    const endpoint = authApiConfig.endpointV1 + '/signup';

    return this._http.post<SignUpResponse>(endpoint, form).pipe(
      map(response => response.profileId)
    );
  }
}

export interface SignInForm {
  email: string,
  password: string,
}

export interface SignInResponse {
  king: 'SignInResponse',
  profileId: string,
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
