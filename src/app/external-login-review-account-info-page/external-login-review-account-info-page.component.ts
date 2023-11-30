import { Component, OnInit } from '@angular/core';
import { AlertType } from '../shared/alert/alert-type';
import { first, map, Observable, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { hasNoValue } from '../shared/empty.util';
import { Registration } from '../core/shared/registration.model';
import { RemoteData } from '../core/data/remote-data';

@Component({
  templateUrl: './external-login-review-account-info-page.component.html',
  styleUrls: ['./external-login-review-account-info-page.component.scss']
})
export class ExternalLoginReviewAccountInfoPageComponent implements OnInit {
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
  public registrationData$: Observable<Registration>;
  /**
   * Whether the component has errors
   */
  public hasErrors = false;

  constructor(
    private arouter: ActivatedRoute
  ) {
    this.token = this.arouter.snapshot.params.token;
    this.hasErrors = hasNoValue(this.arouter.snapshot.params.token);
  }

  ngOnInit(): void {
    this.registrationData$ = this.arouter.data.pipe(
      first(),
      tap((data) => this.hasErrors = (data.registrationData as RemoteData<Registration>).hasFailed),
      map((data) => (data.registrationData as RemoteData<Registration>).payload));
  }
}

