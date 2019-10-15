import { filter, map, takeWhile } from 'rxjs/operators';
import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  AuthenticateAction,
  ResetAuthenticationMessagesAction
} from '../../../../core/auth/auth.actions';

import {
  getAuthenticationError,
  getAuthenticationInfo,
  isAuthenticated,
  isAuthenticationLoading,
} from '../../../../core/auth/selectors';
import { CoreState } from '../../../../core/core.reducers';

import { isNotEmpty } from '../../../empty.util';
import { fadeOut } from '../../../animations/fade';
import { AuthService } from '../../../../core/auth/auth.service';
import { AuthMethodType } from '../authMethods-type';
import { renderAuthMethodFor } from '../authMethods-decorator';
import { AuthMethodModel } from '../../../../core/auth/models/auth-method.model';
import { InjectedAuthMethodModel } from '../../injectedAuthMethodModel/injectedAuthMethodModel';

/**
 * /users/sign-in
 * @class LogInPasswordComponent
 */
@Component({
  selector: 'ds-log-in-password',
  templateUrl: './log-in-password.component.html',
  styleUrls: ['./log-in-password.component.scss'],
  animations: [fadeOut]
})
@renderAuthMethodFor(AuthMethodType.Password)
export class LogInPasswordComponent implements OnInit {

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

  @Input() authMethodModel: InjectedAuthMethodModel;

  /**
   * @constructor
   * @param {AuthService} authService
   * @param {FormBuilder} formBuilder
   * @param {Store<State>} store
   */
  constructor(
    @Inject('authMethodModelProvider') public injectedAuthMethodModel: InjectedAuthMethodModel,
   /* private authService: AuthService,*/
    private formBuilder: FormBuilder,
    private store: Store<CoreState>
  ) {
    this.authMethodModel = injectedAuthMethodModel;
  }

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

}
