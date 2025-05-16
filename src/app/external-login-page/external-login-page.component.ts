import { AsyncPipe } from '@angular/common';
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

import { AuthMethodType } from '../core/auth/models/auth.method-type';
import { RemoteData } from '../core/data/remote-data';
import { Registration } from '../core/shared/registration.model';
import { ExternalLogInComponent } from '../external-log-in/external-log-in/external-log-in.component';
import { AlertComponent } from '../shared/alert/alert.component';
import { AlertType } from '../shared/alert/alert-type';
import { hasNoValue } from '../shared/empty.util';
import { AuthMethodTypeComponent } from '../shared/log-in/methods/auth-methods.type';
import { AUTH_METHOD_FOR_DECORATOR_MAP } from '../shared/log-in/methods/log-in.methods-decorator';

@Component({
  templateUrl: './external-login-page.component.html',
  styleUrls: ['./external-login-page.component.scss'],
  imports: [
    AlertComponent,
    AsyncPipe,
    ExternalLogInComponent,
    TranslateModule,
  ],
  standalone: true,
})
/**
 * This component is a wrapper of the external-login component that loads up the RegistrationData.
 */
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

  public authMethods: Map<AuthMethodType, AuthMethodTypeComponent>;

  constructor(
    private arouter: ActivatedRoute,
  ) {
    this.token = this.arouter.snapshot.params.token;
    this.hasErrors = hasNoValue(this.arouter.snapshot.params.token);
    this.authMethods = AUTH_METHOD_FOR_DECORATOR_MAP;
  }

  ngOnInit(): void {
    this.registrationData$ =
      this.arouter.data.pipe(
        first(),
        tap((data) => this.hasErrors = (data.registrationData as RemoteData<Registration>).hasFailed),
        map((data) => (data.registrationData as RemoteData<Registration>).payload),
      );
  }
}
