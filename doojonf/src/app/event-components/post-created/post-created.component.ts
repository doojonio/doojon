import { Component, OnInit } from '@angular/core';
import { PostCreatedEvent } from 'src/app/event-services/events.service';
import { PostsService } from 'src/app/post-services/posts.service';

@Component({
  selector: 'app-post-created',
  templateUrl: './post-created.component.html',
  styleUrls: ['./post-created.component.scss'],
})
export class PostCreatedComponent implements OnInit {
  event!: PostCreatedEvent;
  private likeRequestInProgress = false;

  constructor(private _posts: PostsService) {}

  ngOnInit(): void {}

  toggleLike() {
    const post = this.event.post;
    post.liked = !this.event.post.liked;

    if (this.likeRequestInProgress) return;

    this.likeRequestInProgress = true;

    if (post.liked) {
      post.likes++;
      this._posts.likePost(post.id).subscribe(
        id => {
          this.likeRequestInProgress = false;
        },
        err => {
          post.liked = !post.liked;
          post.likes--;
        }
      );
    } else {
      post.likes--;
      this._posts.unlikePost(post.id).subscribe(
        id => {
          this.likeRequestInProgress = false;
        },
        err => {
          post.likes++;
          post.liked = !post.liked;
        }
      );
    }
  }
}
