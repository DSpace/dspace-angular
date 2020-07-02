import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { filter, takeWhile, } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';

import { AuthMethod } from '../../core/auth/models/auth.method';
import { getAuthenticationMethods, isAuthenticated, isAuthenticationLoading } from '../../core/auth/selectors';
import { CoreState } from '../../core/core.reducers';
import { AuthService } from '../../core/auth/auth.service';
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
export class LogInComponent implements OnInit, OnDestroy {

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

  /**
   * Component state.
   * @type {boolean}
   */
  private alive = true;

  constructor(private store: Store<CoreState>,
              private authService: AuthService,) {
  }

  ngOnInit(): void {

    this.authMethods = this.store.pipe(
      select(getAuthenticationMethods),
    );

    // set loading
    this.loading = this.store.pipe(select(isAuthenticationLoading));

    // set isAuthenticated
    this.isAuthenticated = this.store.pipe(select(isAuthenticated));

    // subscribe to success
    this.store.pipe(
      select(isAuthenticated),
      takeWhile(() => this.alive),
      filter((authenticated) => authenticated))
      .subscribe(() => {
          this.authService.redirectAfterLoginSuccess(this.isStandalonePage);
        }
      );

  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  getRegisterPath() {
    return getRegisterPath();
  }

  getForgotPath() {
    return getForgotPasswordPath();
  }
}
