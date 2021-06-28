import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AccountsService, CreatableAccount } from '../accounts.service';
import { AuthService } from '../auth.service';
import { IdService, IdStatus } from '../id.service';
import { CreatableProfile, ProfilesService } from '../profiles.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  accountForm = this._fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  doojonForm = this._fb.group({
    username: ['', [Validators.required]],
  });

  creatingIsInProcess: Boolean = false;

  authorizedButWithoutProfile?: Boolean;

  constructor(
    private _accounts: AccountsService,
    private _auth: AuthService,
    private _profiles: ProfilesService,
    private _fb: FormBuilder,
    private _router: Router,
    private _id: IdService,
    private _snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this._id.getUserInfo().subscribe(uinfo => {
      if (uinfo?.status === IdStatus.AUTHORIZED) {
        return this._router.navigate([uinfo.profile?.username]);
      }

      if (uinfo?.status === IdStatus.NOPROFILE) {
        this.authorizedButWithoutProfile = true;
      }

      return 1;
    });
  }

  canBeFinished(): Boolean {
    if (
      !this.accountForm.valid ||
      !this.doojonForm.valid ||
      this.creatingIsInProcess
    ) {
      return false;
    }

    return true;
  }

  finish() {
    const account = this.accountForm.value as CreatableAccount;
    const profile = this.doojonForm.value as CreatableProfile;

    this.creatingIsInProcess = true;

    this._accounts.createAccount(account).subscribe(_ => {
      this._auth
        .authWithPassword(account.email, account.password)
        .subscribe(_ => {
          this._profiles.createProfile(profile).subscribe(_ => {
            this._id.getUserInfo({ forceRefresh: true }).subscribe(uinfo => {
              this._router.navigate([uinfo?.profile?.username || '']);
            });
          }, this.onError)
        }, this.onError)
    }, this.onError);
  }

  finishWithoutAccount() {
    const profile = this.doojonForm.value as CreatableProfile;

    this.creatingIsInProcess = true;
    this._profiles.createProfile(profile).subscribe(_ => {
      this._id.getUserInfo({ forceRefresh: true }).subscribe(uinfo => {
        this._router.navigate([uinfo?.profile?.username]);
      });
    });
  }

  canBeFinishedWithoutAccount(): Boolean {
    if (this.creatingIsInProcess) return false;

    return this.doojonForm.valid;
  }

  onError() {
    this._snackbar.open('Sorry, something has failed', undefined, {
      duration: 5000,
    });
    this.creatingIsInProcess = false;
  }
}
