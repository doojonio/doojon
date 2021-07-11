import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigService, DoojonApiConfig } from '../config.service';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  _api: DoojonApiConfig;

  constructor(
    private _http: HttpClient,
    config: ConfigService,
  ) {
    this._api = config.getDoojonApiConfig();
  }

  createPost(post: CreatablePost): Observable<string> {
    const url = this._api.endpoint + '/resource/posts';
    return this._http.post<CreatedPostId[]>(url, post).pipe(
      map(ids => {
        return ids[0].id;
      })
    );
  }
}

export interface CreatablePost {
  title?: string,
  text: string,
  is_hidden: boolean,
}

export interface CreatedPostId {
  id: string
}
