import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment as env } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private _configLocation: string;
  private _config: Config | undefined;

  constructor(private _http: HttpClient) {
    this._configLocation = env.configLocation;
  }

  getConfig(): Observable<Config> {
    if (this._config !== undefined) return of(this._config);

    return this._http
      .get<Config>(this._configLocation)
      .pipe(tap(config => (this._config = config)));
  }
}

export interface Config {
  apis: ApisConfig;
}

export interface ApisConfig {
  doojon: DoojonApiConfig;
  accounts: AccountsApiConfig;
}

export interface DoojonApiConfig {
  endpoint: string;
}

export interface AccountsApiConfig {
  endpoint: string;
}
