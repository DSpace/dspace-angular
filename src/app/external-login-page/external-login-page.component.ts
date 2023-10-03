import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { hasNoValue } from '../shared/empty.util';
import { RegistrationData } from '../shared/external-log-in-complete/models/registration-data.model';
import { mockRegistrationDataModel } from '../shared/external-log-in-complete/models/registration-data.mock.model';
import { AlertType } from '../shared/alert/aletr-type';
import { Observable, first, map, of, tap } from 'rxjs';

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
  public registrationData$: Observable<RegistrationData>;
  /**
   * The type of alert to show.
   */
  public AlertTypeEnum = AlertType;
  /**
   * Whether the component has errors.
   */
  public hasErrors = false;

  constructor(
    private arouter: ActivatedRoute
  ) {
    this.token = this.arouter.snapshot.queryParams.token;
    this.hasErrors = hasNoValue(this.arouter.snapshot.queryParams.token);
  }

  ngOnInit(): void {
    this.registrationData$ = this.arouter.data.pipe(
    first(),
    tap((data) => this.hasErrors = hasNoValue(data.registrationData)),
    map((data) => data.registrationData));


    // TODO: remove this line (temporary)
    this.registrationData$ = of(
      mockRegistrationDataModel
    );
    this.hasErrors = false;
    this.token = '1234567890';
  }
}
