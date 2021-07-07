import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccountsService } from '../user-services/accounts.service';

@Injectable({providedIn: 'root'})
export class UniqueEmailValidator implements AsyncValidator {

  constructor(private _accounts: AccountsService) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {

    return this._accounts.isEmailAvailable(control.value).pipe(
      map(isAvailable => (isAvailable ? null : {notavailable: true}))
    );
  }
}
