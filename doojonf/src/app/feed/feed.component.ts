import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IdService, UserInfo } from '../user-services/id.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {
  uinfo$: BehaviorSubject<UserInfo | undefined>;

  constructor(_id: IdService) {
    this.uinfo$ = _id.getUserInfo();
  }

  ngOnInit(): void {
  }

}
