import {
  AsyncPipe,
  NgIf,
} from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  first,
  map,
  Observable,
  tap,
} from 'rxjs';

import { RemoteData } from '../core/data/remote-data';
import { Registration } from '../core/shared/registration.model';
import { ExternalLogInComponent } from '../external-log-in/external-log-in/external-log-in.component';
import { AlertComponent } from '../shared/alert/alert.component';
import { AlertType } from '../shared/alert/alert-type';
import { hasNoValue } from '../shared/empty.util';

@Component({
  templateUrl: './external-login-page.component.html',
  styleUrls: ['./external-login-page.component.scss'],
  standalone: true,
  imports: [
    AlertComponent,
    ExternalLogInComponent,
    AsyncPipe,
    NgIf,
    TranslateModule,
  ],
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
  public registrationData$: Observable<Registration>;
  /**
   * The type of alert to show.
   */
  public AlertTypeEnum = AlertType;
  /**
   * Whether the component has errors.
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
