import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProfilesService } from '../user-services/profiles.service';

@Injectable({providedIn: 'root'})
export class UniqueUsernameValidator implements AsyncValidator {

  constructor(private _profiles: ProfilesService) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {

    return this._profiles.isUsernameAvailable(control.value).pipe(
      map(isAvailable => (isAvailable ? null : {notavailable: true}))
    );
  }
}
