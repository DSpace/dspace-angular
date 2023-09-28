import { Component, OnInit } from '@angular/core';
import { RegistrationData } from '../shared/external-log-in-complete/models/registration-data.model';
import { EpersonRegistrationService } from '../core/data/eperson-registration.service';
import { ActivatedRoute } from '@angular/router';
import { hasValue } from '../shared/empty.util';
import { Registration } from '../core/shared/registration.model';
import { Observable, map, of } from 'rxjs';
import { getRemoteDataPayload } from '../core/shared/operators';
import { AlertType } from '../shared/alert/aletr-type';

@Component({
  templateUrl: './external-login-validation-page.component.html',
  styleUrls: ['./external-login-validation-page.component.scss'],
})
export class ExternalLoginValidationPageComponent implements OnInit {
  /**
   * The token used to get the registration data
   */
  public token: string;

  /**
   * The type of alert to show
   */
  public AlertTypeEnum = AlertType;

  /**
   * The registration data of the user
   */
  public registrationData$: Observable<RegistrationData>
  //  = of(
  //   mockRegistrationDataModel
  // );

  constructor(
    private epersonRegistrationService: EpersonRegistrationService,
    private arouter: ActivatedRoute
  ) {
    this.token = this.arouter.snapshot.queryParams.token;
  }

  ngOnInit(): void {
    // -> if email address is not used by other user => Email Validated component
    // -> if email address is used by other user => Review account information component
    this.getRegistrationData();
    // TODO: remove this line (temporary)
    // this.token = '1234567890';
  }
  /**
   * Get the registration data from the token
   */
  getRegistrationData() {
    if (hasValue(this.token)) {
      this.registrationData$ = this.epersonRegistrationService
        .searchByToken(this.token)
        .pipe(
          getRemoteDataPayload(),
          map((registration: Registration) =>
            Object.assign(new RegistrationData(), registration)
          )
        );
    }
  }
}
