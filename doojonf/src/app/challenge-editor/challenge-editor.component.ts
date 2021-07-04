import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import {
  ChallengesService,
  CreatableChallenge,
} from '../challenge-services/challenges.service';

@Component({
  selector: 'app-challenge-editor',
  templateUrl: './challenge-editor.component.html',
  styleUrls: ['./challenge-editor.component.scss'],
})
export class ChallengeEditorComponent implements AfterViewInit, OnInit {
  @ViewChild('title')
  titleField?: ElementRef;
  form = this._fb.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    is_hidden: [true],
  });

  constructor(
    private _fb: FormBuilder,
    private _challenges: ChallengesService,
    private _snackbar: MatSnackBar,
    private _router: Router
  ) {}

  ngOnInit() {}

  ngAfterViewInit(): void {
    (this.titleField?.nativeElement as HTMLInputElement).focus();
  }

  canFinish() {
    return this.form.valid;
  }

  finish() {
    const challenge = this.form.value as CreatableChallenge;
    this._challenges.createChallenge(challenge).subscribe(
      ids => {
        this._router.navigate(['show'], { queryParams: { c: ids[0].id } });
      },
      err => {
        this._snackbar.open('Sorry, something wrong happened', undefined, {
          duration: 3000,
        });
      }
    );
  }
}
