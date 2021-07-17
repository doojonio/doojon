import { Component, OnInit } from '@angular/core';
import { PostCreatedEvent } from 'src/app/event-services/events.service';

@Component({
  selector: 'app-post-created',
  templateUrl: './post-created.component.html',
  styleUrls: ['./post-created.component.scss'],
})
export class PostCreatedComponent implements OnInit {
  event!: PostCreatedEvent;

  constructor() {}

  ngOnInit(): void {}
}
