import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  constructor() {}

  private _apis = environment.apis;

  getDoojonApiConfig() {
    return this._apis.doojon;
  }
}
