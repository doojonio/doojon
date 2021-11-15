import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotAuthorizedError } from 'src/app/app-api-errors';
import { SorrySnackBarComponent } from 'src/app/app-components/sorry-snack-bar/sorry-snack-bar.component';
import { AuthService, SignInForm } from '../auth.service';
import { FailedAuthSnackBarComponent } from '../failed-auth-snack-bar/failed-auth-snack-bar.component';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent implements OnInit {
  constructor(
    fb: FormBuilder,
    private _auth: AuthService,
    private _snackBar: MatSnackBar
  ) {
    this.signInForm = fb.group({
      email: ['', this._emailValidators],
      password: ['', this._passwordValidators],
    });
  }

  signInForm: FormGroup;
  showPassword = false;
  private _emailValidators = [Validators.required, Validators.email];
  private _passwordValidators = [
    Validators.required,
    Validators.minLength(8),
    Validators.maxLength(32),
  ];
  private _isSingInInInProgress = false;

  ngOnInit(): void {}

  doSignIn() {
    if (this.signInForm.invalid) {
      return;
    }

    const signInForm: SignInForm = this.signInForm.value;
    this._isSingInInInProgress = true;
    this._auth.signIn(signInForm).subscribe(
      profileId => {
        this._isSingInInInProgress = false;
      },
      error => {
        this._isSingInInInProgress = false;
        if (error instanceof NotAuthorizedError) {
          this._snackBar.openFromComponent(FailedAuthSnackBarComponent, {
            duration: 5000,
          });
        } else {
          this._snackBar.openFromComponent(SorrySnackBarComponent, {
            duration: 5000,
          });
        }
      }
    );
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  isSignInLocked() {
    return this.signInForm.invalid || this._isSingInInInProgress;
  }

  getEmailError() {
    const email = this.signInForm.get('email');
    const possibleErrorCodes = ['required', 'email'];

    for (const possibleErrorCode of possibleErrorCodes) {
      if (email?.hasError(possibleErrorCode)) {
        return possibleErrorCode;
      }
    }

    return;
  }

  getPasswordError() {
    const password = this.signInForm.get('password');
    const possibleErrorCodes = ['required', 'minlength', 'maxlength'];

    for (const possibleErrorCode of possibleErrorCodes) {
      if (password?.hasError(possibleErrorCode)) {
        return possibleErrorCode;
      }
    }

    return;
  }
}
