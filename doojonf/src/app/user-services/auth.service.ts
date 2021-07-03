import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AccountsApiConfig, ConfigService } from '../config.service';
import { IdService } from './id.service';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _apiConfig: AccountsApiConfig;

  constructor(
    configService: ConfigService,
    private _http: HttpClient,
    private _id: IdService
  ) {
    this._apiConfig = configService.getAccountsApiConfig();
  }

  authWithPassword(email: string, password: string): Observable<string> {
    const url = this._apiConfig.endpoint + '/auth';
    const creds: PasswordAuthCreds = { email, password };

    return this._http.post(url, creds, { responseType: 'text' });
  }

  logout(): Observable<string> {
    const url = this._apiConfig.endpoint + '/logout';
    return this._http.delete(url, { responseType: 'text' }).pipe(tap(_ => {
      this._id.onLogout()
    }));
  }
}

interface PasswordAuthCreds {
  email: string;
  password: string;
}
