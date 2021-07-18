import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ObserveOnMessage } from 'rxjs/internal/operators/observeOn';
import { map } from 'rxjs/operators';
import { ConfigService, DoojonApiConfig } from '../config.service';
import { EventId, EventType } from '../event-services/events.service';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  _api: DoojonApiConfig;

  constructor(private _http: HttpClient, config: ConfigService) {
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

  likePost(id: string): Observable<string> {
    const url = this._api.endpoint + '/resource/events';
    const event = { type: EventType.POST_LIKED, object: id };
    return this._http.post<EventId[]>(url, event).pipe(
      map(ids => ids[0].id)
    )
  }

  unlikePost(id: string): Observable<string> {
    const url = this._api.endpoint + '/resource/events';
    const params = { type: EventType.POST_LIKED, object: id };
    return this._http.delete<EventId[]>(url, {params}).pipe(
      map(ids => ids[0].id)
    )
  }
}

export interface CreatablePost {
  title?: string;
  text: string;
  is_hidden: boolean;
}

export interface CreatedPostId {
  id: string;
}
