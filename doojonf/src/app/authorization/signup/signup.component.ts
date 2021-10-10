import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  securityForm: FormGroup;
  usernameForm: FormControl;

  constructor(formBuilder: FormBuilder) {
    this.securityForm = formBuilder.group({
      email: ['', this.emailValidators],
      password: ['', this.passwordValidators],
    });
    this.usernameForm = formBuilder.control('', this.usernameValidators);
  }

  showPassword = false;

  private emailValidators = [
    Validators.required,
    Validators.email,
  ];

  private passwordValidators = [
    Validators.required,
    Validators.minLength(8),
    Validators.maxLength(32),
  ];

  private usernameValidators = [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(16),
  ];

  ngOnInit(): void {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  getEmailError() {
    const email = this.securityForm.get('email');
    const possibleErrorCodes = [
      'required',
      'email',
    ];

    for (const possibleErrorCode of possibleErrorCodes) {
      if (email?.hasError(possibleErrorCode)) {
        return possibleErrorCode;
      }
    }

    return;
  }

  getPasswordError() {
    const password = this.securityForm.get('password');
    const possibleErrorCodes = [
      'required',
      'minlength',
      'maxlength',
    ];

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
    ];

    for (const possibleErrorCode of possibleErrorCodes) {
      if (username?.hasError(possibleErrorCode)) {
        return possibleErrorCode;
      }
    }

    return;
  }
}
