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
    Validators.maxLength(320),
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
    const email = this.securityForm.get('security.email');
  }
}
