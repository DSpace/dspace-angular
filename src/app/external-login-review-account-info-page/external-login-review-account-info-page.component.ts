import { AsyncPipe } from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  first,
  map,
  Observable,
  tap,
} from 'rxjs';

import { RemoteData } from '../core/data/remote-data';
import { Registration } from '../core/shared/registration.model';
import { AlertComponent } from '../shared/alert/alert.component';
import { AlertType } from '../shared/alert/alert-type';
import { hasNoValue } from '../shared/empty.util';
import { ReviewAccountInfoComponent } from './review-account-info/review-account-info.component';

@Component({
  templateUrl: './external-login-review-account-info-page.component.html',
  styleUrls: ['./external-login-review-account-info-page.component.scss'],
  imports: [
    AlertComponent,
    AsyncPipe,
    ReviewAccountInfoComponent,
  ],
  standalone: true,
})
/**
 * This component is a wrapper for review-account-info component responsible to provide RegistrationData.
 */
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
    private arouter: ActivatedRoute,
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

