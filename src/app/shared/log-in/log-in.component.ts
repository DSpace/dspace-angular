import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';
import uniqBy from 'lodash/uniqBy';

import { AuthMethod } from '../../core/auth/models/auth.method';
import {
  getAuthenticationError,
  getAuthenticationMethods,
  isAuthenticated,
  isAuthenticationLoading
} from '../../core/auth/selectors';
import { getForgotPasswordRoute, getRegisterRoute } from '../../app-routing-paths';
import { hasValue } from '../empty.util';
import { AuthService } from '../../core/auth/auth.service';
import { AuthorizationDataService } from '../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../core/data/feature-authorization/feature-id';
import { CoreState } from '../../core/core-state.model';
import { AuthMethodType } from '../../core/auth/models/auth.method-type';

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
  public authMethods: AuthMethod[];

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
   * Whether or not the current user (or anonymous) is authorized to register an account
   */
  canRegister$: Observable<boolean>;

  /**
   * Track subscription to unsubscribe on destroy
   * @private
   */
  private authErrorSubscription: Subscription;

  constructor(private store: Store<CoreState>,
              private authService: AuthService,
              private authorizationService: AuthorizationDataService) {
  }

  ngOnInit(): void {

    this.store.pipe(
      select(getAuthenticationMethods),
    ).subscribe(methods => {
      // ignore the ip authentication method when it's returned by the backend
      this.authMethods = uniqBy(methods.filter(a => a.authMethodType !== AuthMethodType.Ip), 'authMethodType');
    });

    // set loading
    this.loading = this.store.pipe(select(isAuthenticationLoading));

    // set isAuthenticated
    this.isAuthenticated = this.store.pipe(select(isAuthenticated));

    // Clear the redirect URL if an authentication error occurs and this is not a standalone page
    this.authErrorSubscription = this.store.pipe(select(getAuthenticationError)).subscribe((error) => {
      if (hasValue(error) && !this.isStandalonePage) {
        this.authService.clearRedirectUrl();
      }
    });

    this.canRegister$ = this.authorizationService.isAuthorized(FeatureID.EPersonRegistration);
  }

  getRegisterRoute() {
    return getRegisterRoute();
  }

  getForgotRoute() {
    return getForgotPasswordRoute();
  }

  ngOnDestroy(): void {
    if (hasValue(this.authErrorSubscription)) {
      this.authErrorSubscription.unsubscribe();
    }
  }
}
