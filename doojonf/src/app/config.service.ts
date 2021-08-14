import { Injectable } from '@angular/core';

import { environment as env } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private _apisConfig: ApisConfig;

  constructor() {
    this._apisConfig = env.apis;
  }

  getAccountsApiConfig(): AccountsApiConfig {
    return this._apisConfig.accounts;
  }

  getDoojonApiConfig(): DoojonApiConfig {
    return this._apisConfig.doojon;
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
  v1endpoint: string;
}

export interface AccountsApiConfig {
  v1endpoint: string;
}
