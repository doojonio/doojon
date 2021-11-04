import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  constructor() {}

  private _apis = environment.apis;

  getAuthApiConfig() {
    return this._apis.auth;
  }
}
