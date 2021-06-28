import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AccountsApiConfig, ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class AccountsService {
  private _apiConfig: AccountsApiConfig;

  constructor(
    configService: ConfigService,
    private _http: HttpClient,
  ) {
    this._apiConfig = configService.getAccountsApiConfig();
  }

  createAccount(acc: CreatableAccount): Observable<ReadableAccount> {
    let url = this._apiConfig.endpoint + "/accounts";
    return this._http.post<ReadableAccount>(url, acc)
  }
}

export interface CreatableAccount {
  email: string,
  password: string,
  first_name?: string,
  last_name?: string,
}

export interface ReadableAccount {
  id: string,
  email: string,
  first_name?: string,
  last_name?: string,
  create_time: string,
  update_time: string,
}
