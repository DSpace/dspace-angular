import { map } from 'rxjs/operators';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { select, Store } from '@ngrx/store';
import { firstValueFrom, Observable } from 'rxjs';
import {
  AuthenticateAction,
  ResetAuthenticationMessagesAction
} from '../../../../core/auth/auth.actions';

import { getAuthenticationError, getAuthenticationInfo } from '../../../../core/auth/selectors';
import { isEmpty, isNotEmpty } from '../../../empty.util';
import { fadeOut } from '../../../animations/fade';
import { AuthMethodType } from '../../../../core/auth/models/auth.method-type';
import { renderAuthMethodFor } from '../log-in.methods-decorator';
import { AuthMethod } from '../../../../core/auth/models/auth.method';
import { AuthService } from '../../../../core/auth/auth.service';
import { CoreState } from '../../../../core/core-state.model';
import { ActivatedRoute , Router} from '@angular/router';
import { getBaseUrl } from '../../../clarin-shared-util';
import { ConfigurationProperty } from '../../../../core/shared/configuration-property.model';
import { ConfigurationDataService } from '../../../../core/data/configuration-data.service';

/**
 * /users/sign-in
 * @class LogInPasswordComponent
 */
@Component({
  selector: 'ds-log-in-password',
  templateUrl: './log-in-password.component.html',
  styleUrls: ['./log-in-password.component.scss'],
  animations: [fadeOut],
})
@renderAuthMethodFor(AuthMethodType.Password)
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
   * @type {FormGroup}
   */
  public form: FormGroup;

  /**
   * The page from where the local login was initiated.
   */
  public redirectUrl = '';

  /**
   * `dspace.ui.url` property fetched from the server.
   */
  public baseUrl = '';

  /**
   * @constructor
   * @param {AuthMethod} injectedAuthMethodModel
   * @param {boolean} isStandalonePage
   * @param {AuthService} authService
   * @param {HardRedirectService} hardRedirectService
   * @param {FormBuilder} formBuilder
   * @param {Store<State>} store
   * @param route
   * @param router
   * @param configurationService
   */
  constructor(
    @Inject('authMethodProvider') public injectedAuthMethodModel: AuthMethod,
    @Inject('isStandalonePage') public isStandalonePage: boolean,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private store: Store<CoreState>,
    private route: ActivatedRoute,
    protected router: Router,
    protected configurationService: ConfigurationDataService,
  ) {
    this.authMethod = injectedAuthMethodModel;
  }

  /**
   * Lifecycle hook that is called after data-bound properties of a directive are initialized.
   * @method ngOnInit
   */
  public async ngOnInit() {
    this.redirectUrl = '';
    // set formGroup
    this.form = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });

    // set error
    this.error = this.store.pipe(select(
      getAuthenticationError),
      map((error) => {
        this.hasError = (isNotEmpty(error));
        return error;
      })
    );

    // set error
    this.message = this.store.pipe(
      select(getAuthenticationInfo),
      map((message) => {
        this.hasMessage = (isNotEmpty(message));
        return message;
      })
    );

    // Load `dspace.ui.url` into `baseUrl` property.
    await this.assignBaseUrl();
    this.toggleDiscojuiceLogin();
    void this.setUpRedirectUrl();
  }

  /**
   * Set up redirect URL. It could be loaded from the `authorizationService.getRedirectUrl()` or from the url.
   */
  public async setUpRedirectUrl() {
    const fetchedRedirectUrl = await firstValueFrom(this.authService.getRedirectUrl());
    if (isNotEmpty(fetchedRedirectUrl)) {
      // Bring over the item ID as a query parameter
      const queryParams = { redirectUrl: fetchedRedirectUrl };
      // Redirect to login with `redirectUrl` param because the redirectionUrl is lost from the store after click on
      // `local` login.
      void this.router.navigate(['login'], { queryParams: queryParams });
    }

    // Store the `redirectUrl` value from the url and then remove that value from url.
    // Overwrite `this.redirectUrl` only if it's not stored in the authService `redirectUrl` property.
    if (isEmpty(this.redirectUrl)) {
      this.redirectUrl = this.route.snapshot.queryParams?.redirectUrl;
    }
  }

  private toggleDiscojuiceLogin() {
    if (isEmpty(this.route.snapshot.queryParams?.redirectUrl)) {
      this.popUpDiscoJuiceLogin();
    }
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

    if (!this.isStandalonePage || isNotEmpty(this.redirectUrl)) {
      // Create a URLSearchParams object
      const urlParams = new URLSearchParams(this.redirectUrl.split('?')[1]);
      // Get the value of the 'redirectUrl' parameter
      let redirectUrl = urlParams.get('redirectUrl');
      if (isEmpty(redirectUrl)) {
        redirectUrl = this.redirectUrl;
      }

      this.authService.setRedirectUrl(redirectUrl.replace(this.baseUrl, ''));
    } else {
      this.authService.setRedirectUrlIfNotSet('/');
    }

    // dispatch AuthenticationAction
    this.store.dispatch(new AuthenticateAction(email, password));

    // clear form
    this.form.reset();
  }

  /**
   * Load the `dspace.ui.url` into `baseUrl` property.
   */
  async assignBaseUrl() {
    this.baseUrl = await getBaseUrl(this.configurationService)
      .then((baseUrlResponse: ConfigurationProperty) => {
        return baseUrlResponse?.values?.[0];
      });
  }

  /**
   * Show DiscoJuice login modal using javascript functions. The timeout must be set because of angular component
   * lifecycle. Discojuice won't be showed up without timeout.
   * @private
   */
  private popUpDiscoJuiceLogin() {
    setTimeout(() => {
      document?.getElementById('clarin-signon-discojuice')?.click();
    }, 250);
  }
}
