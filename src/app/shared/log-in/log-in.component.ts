import {filter, map, pairwise, take, takeUntil, takeWhile, tap} from 'rxjs/operators';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { select, Store } from '@ngrx/store';
import {Observable, Subject} from 'rxjs';
import {
  AuthenticateAction,
  ResetAuthenticationMessagesAction
} from '../../core/auth/auth.actions';

import {
  getAuthenticationError,
  getAuthenticationInfo,
  isAuthenticated,
  isAuthenticationLoading,
} from '../../core/auth/selectors';
import { CoreState } from '../../core/core.reducers';

import {isNotEmpty} from '../empty.util';
import { fadeOut } from '../animations/fade';
import {AuthService, LOGIN_ROUTE} from '../../core/auth/auth.service';
import {Router} from '@angular/router';
import {HostWindowService} from '../host-window.service';
import {RouteService} from '../services/route.service';

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

  private redirectUrl = LOGIN_ROUTE;

  /**
   * @constructor
   * @param {AuthService} authService
   * @param {FormBuilder} formBuilder
   * @param {RouteService} routeService
   * @param {Router} router
   * @param {HostWindowService} windowService
   * @param {Store<State>} store
   */
  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private routeService: RouteService,
    private router: Router,
    private windowService: HostWindowService,
    private store: Store<CoreState>
  ) {
  }

  /**
   * Lifecycle hook that is called after data-bound properties of a directive are initialized.
   * @method ngOnInit
   */
  public ngOnInit() {
    // set isAuthenticated
    this.isAuthenticated = this.store.pipe(select(isAuthenticated));

    // for mobile login, set the redirect url to the previous route
    this.windowService.isXs().pipe(take(1))
      .subscribe((isMobile) => {
        if (isMobile) {
          this.routeService.getHistory().pipe(
            take(1)
          ).subscribe((history) => {
            const previousIndex = history.length - 2;
            this.setRedirectUrl(history[previousIndex]);
          });
        }
      });

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

    // subscribe to success
    this.store.pipe(
      select(isAuthenticated),
      takeWhile(() => this.alive),
      filter((authenticated) => authenticated))
      .subscribe(() => {
          this.authService.redirectToPreviousUrl();
        }
      );
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

    this.setRedirectUrl(this.router.url);
    // dispatch AuthenticationAction
    this.store.dispatch(new AuthenticateAction(email, password));
    // clear form
    this.form.reset();

  }

  /**
   * Sets the redirect url if not equal to LOGIN_ROUTE
   * @param url
   */
  private setRedirectUrl(url: string) {
    if (url !== this.redirectUrl) {
      this.authService.setRedirectUrl(url)
    }
  }
}
