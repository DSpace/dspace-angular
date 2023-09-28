import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { hasValue } from '../shared/empty.util';
import { EpersonRegistrationService } from '../core/data/eperson-registration.service';
import { Registration } from '../core/shared/registration.model';
import { RegistrationData } from '../shared/external-log-in-complete/models/registration-data.model';
import { mockRegistrationDataModel } from '../shared/external-log-in-complete/models/registration-data.mock.model';
import { AlertType } from '../shared/alert/aletr-type';
import { Observable, map, of } from 'rxjs';
import { getRemoteDataPayload } from '../core/shared/operators';

@Component({
  templateUrl: './external-login-page.component.html',
  styleUrls: ['./external-login-page.component.scss'],
})
export class ExternalLoginPageComponent implements OnInit {
  /**
   * The token used to get the registration data,
   * retrieved from the url.
   * @memberof ExternalLoginPageComponent
   */
  public token: string;
  /**
   * The registration data of the user.
   */
  public registrationData$: Observable<RegistrationData> = of(
    mockRegistrationDataModel
  );
  /**
   * The type of alert to show.
   */
  public AlertTypeEnum = AlertType;

  constructor(
    private epersonRegistrationService: EpersonRegistrationService,
    private arouter: ActivatedRoute
  ) {
    this.token = this.arouter.snapshot.queryParams.token;
  }

  ngOnInit(): void {
    this.getRegistrationData();
    // TODO: remove this line (temporary)
    // this.token = '1234567890';
  }

  /**
   * Get the registration data of the user,
   * based on the token.
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
