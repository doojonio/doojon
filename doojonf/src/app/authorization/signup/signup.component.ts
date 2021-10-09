import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  signUpForm: FormGroup;

  constructor(formBuilder: FormBuilder) {
    this.signUpForm = formBuilder.group({
      email: ['', this.emailValidators],
      password: ['', this.passwordValidators],
      username: ['', this.usernameValidators],
    });
  }

  showPassword = false;

  private emailValidators = [
    Validators.requiredTrue,
    Validators.email,
    Validators.maxLength(320),
  ];

  private passwordValidators = [
    Validators.requiredTrue,
    Validators.minLength(8),
    Validators.maxLength(32),
  ];

  private usernameValidators = [
    Validators.requiredTrue,
    Validators.minLength(3),
    Validators.maxLength(16),
  ];

  ngOnInit(): void {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
