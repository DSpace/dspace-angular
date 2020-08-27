import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { AuthMethod } from '../../core/auth/models/auth.method';
import { getAuthenticationMethods, isAuthenticated, isAuthenticationLoading } from '../../core/auth/selectors';
import { CoreState } from '../../core/core.reducers';
import { getForgotPasswordPath, getRegisterPath } from '../../app-routing.module';

/**
 * /users/sign-in
 * @class LogInComponent
 */
@Component({
  selector: 'ds-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent implements OnInit {

  /**
   * A boolean representing if LogInComponent is in a standalone page
   * @type {boolean}
   */
  @Input() isStandalonePage: boolean;

  /**
   * The list of authentication methods available
   * @type {AuthMethod[]}
   */
  public authMethods: Observable<AuthMethod[]>;

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

  constructor(private store: Store<CoreState>) {
  }

  ngOnInit(): void {

    this.authMethods = this.store.pipe(
      select(getAuthenticationMethods),
    );

    // set loading
    this.loading = this.store.pipe(select(isAuthenticationLoading));

    // set isAuthenticated
    this.isAuthenticated = this.store.pipe(select(isAuthenticated));
  }

  getRegisterPath() {
    return getRegisterPath();
  }

  getForgotPath() {
    return getForgotPasswordPath();
  }
}
