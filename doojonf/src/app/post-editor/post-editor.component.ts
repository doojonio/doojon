import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CreatablePost, PostsService } from '../post-services/posts.service';

@Component({
  selector: 'app-post-editor',
  templateUrl: './post-editor.component.html',
  styleUrls: ['./post-editor.component.scss'],
})
export class PostEditorComponent implements OnInit {
  form = this._fb.group({
    text: ['', [Validators.required]],
    is_hidden: [false, Validators.required],
  });
  postInProgress = false;
  @Output()
  postCreated = new EventEmitter();

  constructor(
    private _fb: FormBuilder,
    private _posts: PostsService,
    private _snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  canPost(): boolean {
    return this.form.valid && !this.postInProgress;
  }

  resetForm() {
    this.form.reset();
    this.form.setValue({is_hidden: false, text: ''});
  }

  post() {
    if (!this.canPost()) return;

    const post = this.form.value as CreatablePost;

    this.postInProgress = true;
    this._posts.createPost(post).subscribe(
      id => {
        this.postInProgress = false;
        this.resetForm();
        this.postCreated.emit(id)
      },
      err => {
        this.postInProgress = false;
        this._snackbar.open('Sorry, something went wrong', undefined, {
          duration: 5000,
        });
      }
    );
  }
}
