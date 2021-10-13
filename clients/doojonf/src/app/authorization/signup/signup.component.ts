import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SorrySnackBarComponent } from 'src/app/app-components/sorry-snack-bar/sorry-snack-bar.component';
import { LoggerService } from 'src/app/app-services/logger.service';
import { AuthorizationService, SignUpForm } from '../authorization.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  constructor(
    private _authService: AuthorizationService,
    private _loggerService: LoggerService,
    private _snackBar: MatSnackBar,
    formBuilder: FormBuilder
  ) {
    this.securityForm = formBuilder.group({
      email: ['', this._emailValidators],
      password: ['', this._passwordValidators],
    });
    this.usernameForm = formBuilder.control('', this._usernameValidators);
  }

  showPassword = false;
  usernameForbiddenRegex = /[^a-zA-Z0-9_]+/;
  securityForm: FormGroup;
  usernameForm: FormControl;

  private _isSignUpInProgress = false;
  private _emailValidators = [Validators.required, Validators.email];
  private _passwordValidators = [
    Validators.required,
    Validators.minLength(8),
    Validators.maxLength(32),
  ];
  private _usernameValidators = [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(16),
    this.getForbiddenNameValidator(),
  ];

  ngOnInit(): void {}

  isFinishLocked() {
    return (
      this.securityForm.invalid ||
      this.usernameForm.invalid ||
      this._isSignUpInProgress
    );
  }

  doSignUp() {
    const username = this.usernameForm.value;
    const security = this.securityForm.value;

    const signUpForm: SignUpForm = {
      email: security.email,
      password: security.password,
      username: username,
    };

    this._isSignUpInProgress = true;
    this._authService.signUp(signUpForm).subscribe(
      result => {},
      error => {
        this._loggerService.logError(error);
        this._saySorry();
        this._isSignUpInProgress = false;
      },
    );
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  getForbiddenNameValidator(): ValidatorFn {
    const forbiddenRegex = this.usernameForbiddenRegex;
    return (control: AbstractControl): ValidationErrors | null => {
      const isForbidden = forbiddenRegex.test(control.value);

      if (isForbidden) {
        return { forbidden: { value: control.value } };
      }

      return null;
    };
  }

  getEmailError() {
    const email = this.securityForm.get('email');
    const possibleErrorCodes = ['required', 'email'];

    for (const possibleErrorCode of possibleErrorCodes) {
      if (email?.hasError(possibleErrorCode)) {
        return possibleErrorCode;
      }
    }

    return;
  }

  getPasswordError() {
    const password = this.securityForm.get('password');
    const possibleErrorCodes = ['required', 'minlength', 'maxlength'];

    for (const possibleErrorCode of possibleErrorCodes) {
      if (password?.hasError(possibleErrorCode)) {
        return possibleErrorCode;
      }
    }

    return;
  }

  getUsernameError() {
    const username = this.usernameForm;
    const possibleErrorCodes = [
      'required',
      'minlength',
      'maxlength',
      'forbidden',
    ];

    for (const possibleErrorCode of possibleErrorCodes) {
      if (username?.hasError(possibleErrorCode)) {
        return possibleErrorCode;
      }
    }

    return;
  }

  private _saySorry() {
    this._snackBar.openFromComponent(SorrySnackBarComponent, {
      duration: 3000,
    });
  }
}
