import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AccountsService, CreatableAccount } from '../user-services/accounts.service';
import { AuthService } from '../user-services/auth.service';
import { IdService, IdStatus } from '../user-services/id.service';
import { CreatableProfile, ProfilesService } from '../user-services/profiles.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit, OnDestroy {
  accountForm = this._fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  doojonForm = this._fb.group({
    username: ['', [Validators.required]],
  });

  creatingIsInProcess: Boolean = false;

  authorizedButWithoutProfile?: Boolean;

  private _uninfoSubs?: Subscription;

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
    this._uninfoSubs = this._id.getUserInfo().subscribe(uinfo => {
      if (uinfo?.status === IdStatus.AUTHORIZED) {
        return this._router.navigate([uinfo.profile?.username]);
      }

      if (uinfo?.status === IdStatus.NOPROFILE) {
        this.authorizedButWithoutProfile = true;
      }

      return 1;
    });
  }

  ngOnDestroy() {
    this._uninfoSubs?.unsubscribe();
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
          this._profiles.createProfile(profile).subscribe(ids => {
            this._id.getUserInfo({ forceRefresh: true });
          }, this.onError)
        }, this.onError)
    }, this.onError);
  }

  finishWithoutAccount() {
    const profile = this.doojonForm.value as CreatableProfile;

    this.creatingIsInProcess = true;
    this._profiles.createProfile(profile).subscribe(ids => {
      this._id.getUserInfo({ forceRefresh: true });
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
