import {filter, map, takeWhile} from 'rxjs/operators';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {
  AuthenticateAction,
  ResetAuthenticationMessagesAction, GetJWTafterShibbLoginAction
} from '../../core/auth/auth.actions';

import {
  getAuthenticationError,
  getAuthenticationInfo, getSSOLoginUrl,
  isAuthenticated,
  isAuthenticationLoading,
} from '../../core/auth/selectors';
import {CoreState} from '../../core/core.reducers';

import {isNotEmpty} from '../empty.util';
import {fadeOut} from '../animations/fade';
import {AuthService} from '../../core/auth/auth.service';

/**
 * /users/sign-in
 * @class LogInComponent
 */
@Component({
  selector: 'ds-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss'],
  animations: [fadeOut]
})
export class LogInComponent implements OnDestroy, OnInit {

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
   * Whether user is authenticated.
   * @type {Observable<string>}
   */
  public isAuthenticated: Observable<boolean>;

  /**
   * True if the authentication is loading.
   * @type {boolean}
   */
  public loading: Observable<boolean>;

  /**
   * The authentication form.
   * @type {FormGroup}
   */
  public form: FormGroup;

  /**
   * Component state.
   * @type {boolean}
   */
  private alive = true;

  /**
   * The redirect url to login with sso.
   * @type {Observable<string>}
   */
  public ssoLoginUrl: Observable<string>;

  /**
   * True if is present the url to login with sso.
   * @type {Observable<boolean>}
   */
  public hasSsoLoginUrl: Observable<boolean>;

  /**
   * @constructor
   * @param {AuthService} authService
   * @param {FormBuilder} formBuilder
   * @param {Store<State>} store
   */
  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private store: Store<CoreState>,

  ) {
  }

  /**
   * Lifecycle hook that is called after data-bound properties of a directive are initialized.
   * @method ngOnInit
   */
  public ngOnInit() {
    // set isAuthenticated
    this.isAuthenticated = this.store.pipe(select(isAuthenticated));

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

    // set loading
    this.loading = this.store.pipe(select(isAuthenticationLoading));

    // set sso login url
    this.ssoLoginUrl = this.store.pipe(select(getSSOLoginUrl));

    // subscribe to success
    this.store.pipe(
      select(isAuthenticated),
      takeWhile(() => this.alive),
      filter((authenticated) => authenticated))
      .subscribe(() => {
          this.authService.redirectToPreviousUrl();
        }
      );

    this.hasSsoLoginUrl = this.ssoLoginUrl
      .pipe(map((url) => isNotEmpty(url)))
  }

  /**
   *  Lifecycle hook that is called when a directive, pipe or service is destroyed.
   * @method ngOnDestroy
   */
  public ngOnDestroy() {
    this.alive = false;
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
   * To the registration page.
   * @method register
   */
  public register() {
    // TODO enable after registration process is done
    // this.router.navigate(['/register']);
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

    // dispatch AuthenticationAction
    this.store.dispatch(new AuthenticateAction(email, password));

    // clear form
    this.form.reset();
  }

/*  public postLoginCall() {
    console.log('postLoginCall() was called');
    /!*   const email = 'test@test.at';
       const password = 'test';
       this.store.dispatch(new AuthenticateAction(email, password));*!/
    this.http.post('https://fis.tiss.tuwien.ac.at/spring-rest/api/authn/login',
      {
        name: 'morpheus',
        job: 'leader'
      })
      .subscribe(
        (val) => {
          console.log('POST call successful value returned in body',
            val);
        },
        (response) => {
          console.log('POST call in error', response);
        },
        () => {
          console.log('The POST observable is now completed.');
        });
  }*/

  dispatchShibbLoginAction() {
    console.log('dispatchShibbLoginAction() was called');
    // const ssoLoginUrl = 'https://fis.tiss.tuwien.ac.at/Shibboleth.sso/Login'
    this.store.dispatch(new GetJWTafterShibbLoginAction());
    // this.store.dispatch(new AuthenticateAction(email, password));

  }
}
