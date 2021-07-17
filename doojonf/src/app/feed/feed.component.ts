import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Event, EventsService, GetEventsOptions } from '../event-services/events.service';
import { IdService, UserInfo } from '../user-services/id.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss'],
})
export class FeedComponent implements OnInit {
  uinfo$: BehaviorSubject<UserInfo | undefined>;
  events: Array<Event> = [];

  constructor(private _events: EventsService, _id: IdService) {
    this.uinfo$ = _id.getUserInfo();
  }

  ngOnInit(): void {
    this.updateEvents();
  }

  updateEvents() {
    const options: GetEventsOptions = {};
    if (this.events.length !== 0)
      options.sinceEvent = this.events[0].id;

    this._events
      .getEventsFromFollowing(options)
      .subscribe(events => (this.events = events.concat(this.events)));
  }
}
