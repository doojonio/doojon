import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService, DoojonApiConfig } from '../config.service';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  private _api: DoojonApiConfig;

  constructor(private _http: HttpClient, config: ConfigService) {
    this._api = config.getDoojonApiConfig();
  }

  getEventsFromFollowing(options?: GetEventsOptions): Observable<Array<Event>> {
    const url = this._api.v1endpoint + '/resource/events/following';

    let params = new HttpParams();

    if (options?.sinceEvent !== undefined)
      params = params.set('sinceEvent', options.sinceEvent);
    if (options?.beforeEvent !== undefined)
      params = params.set('beforeEvent', options.beforeEvent);
    if (options?.limit !== undefined)
      params = params.set('limit', options.limit);

    return this._http.get<Array<Event>>(url, { params });
  }
}

export interface GetEventsOptions {
  limit?: number;
  sinceEvent?: string;
  beforeEvent?: string;
}

export enum EventType {
  FOLLOWING_STARTED = 'following_started',
  CHALLENGE_CREATED = 'challenge_created',
  CHALLENGE_COMMENTED = 'challenge_commented',
  CHALLENGE_PROPOSED = 'challenge_proposed',
  CHALLENGE_PROPOSAL_COMMENTED = 'challenge_proposal_commented',
  POST_CREATED = 'post_created',
  POST_LIKED = 'post_liked',
  POST_COMMENTED = 'post_commented',
  POST_COMMENT_LIKED = 'post_comment_liked',
}

export interface Event {
  id: string;
  user: string;
  type: EventType;
  object: string;
  when: string;
}

export interface EventId {
  id: string;
}

export interface PostCreatedEvent extends Event {
  post: LinkedPost;
}

export interface LinkedPost {
  id: string;
  is_hidden: boolean;
  tags: Array<string>;
  text: string;
  likes: number;
  comments: number;
  title?: string;
  update_time?: string;
  liked?: boolean;
}
