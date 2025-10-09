import { AsyncPipe } from '@angular/common';
import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  select,
  Store,
} from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import {
  combineLatest,
  Observable,
  shareReplay,
} from 'rxjs';
import {
  filter,
  map,
} from 'rxjs/operators';

import {
  getForgotPasswordRoute,
  getRegisterRoute,
} from '../../../../app-routing-paths';
import {
  AuthenticateAction,
  ResetAuthenticationMessagesAction,
} from '../../../../core/auth/auth.actions';
import { AuthService } from '../../../../core/auth/auth.service';
import { AuthMethod } from '../../../../core/auth/models/auth.method';
import {
  getAuthenticationError,
  getAuthenticationInfo,
} from '../../../../core/auth/selectors';
import { CoreState } from '../../../../core/core-state.model';
import { AuthorizationDataService } from '../../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../../core/data/feature-authorization/feature-id';
import { HardRedirectService } from '../../../../core/services/hard-redirect.service';
import { fadeOut } from '../../../animations/fade';
import { BtnDisabledDirective } from '../../../btn-disabled.directive';
import { isNotEmpty } from '../../../empty.util';
import { BrowserOnlyPipe } from '../../../utils/browser-only.pipe';

/**
 * /users/sign-in
 * @class LogInPasswordComponent
 */
@Component({
  selector: 'ds-log-in-password',
  templateUrl: './log-in-password.component.html',
  styleUrls: ['./log-in-password.component.scss'],
  animations: [fadeOut],
  standalone: true,
  imports: [
    AsyncPipe,
    BrowserOnlyPipe,
    BtnDisabledDirective,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    TranslateModule,
  ],
})
export class LogInPasswordComponent implements OnInit {

  /**
   * The authentication method data.
   * @type {AuthMethod}
   */
  public authMethod: AuthMethod;

  /**
   * The error if authentication fails.
   * @type {Observable<string>}
   */
  public error: Observable<string>;

  /**
   * Has authentication error.
   * @type {boolean}
   */
  public hasError = false;

  /**
   * The authentication info message.
   * @type {Observable<string>}
   */
  public message: Observable<string>;

  /**
   * Has authentication message.
   * @type {boolean}
   */
  public hasMessage = false;

  /**
   * The authentication form.
   * @type {UntypedFormGroup}
   */
  public form: UntypedFormGroup;

  /**
   * Whether the current user (or anonymous) is authorized to register an account
   */
  public canRegister$: Observable<boolean>;

  /**
   * Whether or not the current user (or anonymous) is authorized to register an account
   */
  canForgot$: Observable<boolean>;

  /**
   * Shows the divider only if contains at least one link to show
   */
  canShowDivider$: Observable<boolean>;


  constructor(
    @Inject('authMethodProvider') public injectedAuthMethodModel: AuthMethod,
    @Inject('isStandalonePage') public isStandalonePage: boolean,
    private authService: AuthService,
    private hardRedirectService: HardRedirectService,
    private formBuilder: UntypedFormBuilder,
    protected store: Store<CoreState>,
    protected authorizationService: AuthorizationDataService,
  ) {
    this.authMethod = injectedAuthMethodModel;
  }

  /**
   * Lifecycle hook that is called after data-bound properties of a directive are initialized.
   * @method ngOnInit
   */
  public ngOnInit() {

    // set formGroup
    this.form = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });

    // set error
    this.error = this.store.pipe(select(
      getAuthenticationError),
    map((error) => {
      this.hasError = (isNotEmpty(error));
      return error;
    }),
    );

    // set error
    this.message = this.store.pipe(
      select(getAuthenticationInfo),
      map((message) => {
        this.hasMessage = (isNotEmpty(message));
        return message;
      }),
    );

    this.canRegister$ = this.authorizationService.isAuthorized(FeatureID.EPersonRegistration).pipe(
      shareReplay({ refCount: false, bufferSize: 1 }),
    );
    this.canForgot$ = this.authorizationService.isAuthorized(FeatureID.EPersonForgotPassword).pipe(
      shareReplay({ refCount: false, bufferSize: 1 }),
    );
    this.canShowDivider$ =
      combineLatest([this.canRegister$, this.canForgot$])
        .pipe(
          map(([canRegister, canForgot]) => canRegister || canForgot),
          filter(Boolean),
        );
  }

  getRegisterRoute() {
    return getRegisterRoute();
  }

  getForgotRoute() {
    return getForgotPasswordRoute();
  }

  /**
   * Reset error or message.
   */
  public resetErrorOrMessage() {
    if (this.hasError || this.hasMessage) {
      this.store.dispatch(new ResetAuthenticationMessagesAction());
      this.hasError = false;
      this.hasMessage = false;
    }
  }

  /**
   * Submit the authentication form.
   * @method submit
   */
  public submit() {
    this.resetErrorOrMessage();
    // get email and password values
    const email: string = this.form.get('email').value;
    const password: string = this.form.get('password').value;

    // trim values
    email.trim();
    password.trim();

    if (!this.isStandalonePage) {
      this.authService.setRedirectUrl(this.hardRedirectService.getCurrentRoute());
    } else {
      this.authService.setRedirectUrlIfNotSet('/');
    }

    // dispatch AuthenticationAction
    this.store.dispatch(new AuthenticateAction(email, password));

    // clear form
    this.form.reset();
  }

}
