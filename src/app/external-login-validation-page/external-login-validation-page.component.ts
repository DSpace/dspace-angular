import { Component, OnInit } from '@angular/core';
import { RegistrationData } from '../shared/external-log-in-complete/models/registration-data.model';
import { mockRegistrationDataModel } from '../shared/external-log-in-complete/models/registration-data.mock.model';
import { EpersonRegistrationService } from '../core/data/eperson-registration.service';
import { ActivatedRoute } from '@angular/router';
import { hasValue } from '../shared/empty.util';
import { RemoteData } from '../core/data/remote-data';
import { Registration } from '../core/shared/registration.model';
import { Observable, map, of, tap } from 'rxjs';
import { getRemoteDataPayload } from '../core/shared/operators';

@Component({
  templateUrl: './external-login-validation-page.component.html',
  styleUrls: ['./external-login-validation-page.component.scss'],
})
export class ExternalLoginValidationPageComponent implements OnInit {
  /**
   * Whether or not the email address is already used by another user
   */
  public emailExists: boolean;
  /**
   * The token used to get the registration data
   */
  public token: string;

  /**
   * The registration data of the user
   */
  public registrationData$: Observable<RegistrationData> = of(
    mockRegistrationDataModel
  );

  constructor(
    private epersonRegistrationService: EpersonRegistrationService,
    private arouter: ActivatedRoute
  ) {
    this.token = this.arouter.snapshot.queryParams.token;
    this.emailExists = true;
  }

  ngOnInit(): void {
    // -> if email address is not used by other user => Email Validated component
    // -> if email address is used by other user => Review account information component
    if (hasValue(this.token)) {
      this.registrationData$ = this.epersonRegistrationService
        .searchByToken(this.token)
        .pipe(
          tap((registration: RemoteData<Registration>) => {
            this.emailExists = hasValue(registration.payload.email);
          }),
          getRemoteDataPayload(),
          map((registration: Registration) =>
            Object.assign(new RegistrationData(), registration)
          )
        );
    }
  }
}
