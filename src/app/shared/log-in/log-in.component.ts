import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// @ngrx
import { Store } from '@ngrx/store';

// rxjs
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/takeWhile';

// actions
import { AuthenticateAction, ResetAuthenticationErrorAction } from '../../core/auth/auth.actions';

// reducers
import {
  getAuthenticationError,
  isAuthenticated,
  isAuthenticationLoading,
} from '../../core/auth/selectors';
import { Router } from '@angular/router';
import { CoreState } from '../../core/core.reducers';

import { isNotEmpty, isNotNull } from '../empty.util';
import { fadeOut } from '../animations/fade';

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
   * @constructor
   * @param {FormBuilder} formBuilder
   * @param {Store<State>} store
   */
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private store: Store<CoreState>
  ) { }

  /**
   * Lifecycle hook that is called after data-bound properties of a directive are initialized.
   * @method ngOnInit
   */
  public ngOnInit() {
    // set formGroup
    this.form = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });

    // set error
    this.error = this.store.select(getAuthenticationError)
      .map((error) => {
        this.hasError = (isNotEmpty(error));
        return error;
      });

    // set loading
    this.loading = this.store.select(isAuthenticationLoading);

    // subscribe to success
    this.store.select(isAuthenticated)
      .takeWhile(() => this.alive)
      .filter((authenticated) => authenticated)
      .subscribe(() => {
        this.router.navigate(['/']);
      });
  }

  /**
   *  Lifecycle hook that is called when a directive, pipe or service is destroyed.
   * @method ngOnDestroy
   */
  public ngOnDestroy() {
    this.alive = false;
  }

  /**
   * Go to the home page.
   * @method home
   */
  public home() {
    this.router.navigate(['/home']);
  }

  /**
   * Reset error.
   */
  public resetError() {
    if (this.hasError) {
      this.store.dispatch(new ResetAuthenticationErrorAction());
      this.hasError = false;
    }
  }

  /**
   * To to the registration page.
   * @method register
   */
  public register() {
    this.router.navigate(['/register']);
  }

  /**
   * Submit the authentication form.
   * @method submit
   */
  public submit() {
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
}
