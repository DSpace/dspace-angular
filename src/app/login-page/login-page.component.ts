import {
  isPlatformBrowser,
  NgIf,
} from '@angular/common';
import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import {
  combineLatest as observableCombineLatest,
  Subscription,
} from 'rxjs';
import {
  filter,
  take,
} from 'rxjs/operators';

import { AppState } from '../app.reducer';
import {
  AddAuthenticationMessageAction,
  AuthenticatedAction,
  AuthenticationSuccessAction,
  ResetAuthenticationMessagesAction,
} from '../core/auth/auth.actions';
import { AuthTokenInfo } from '../core/auth/models/auth-token-info.model';
import { isAuthenticated } from '../core/auth/selectors';
import {
  hasValue,
  isNotEmpty,
} from '../shared/empty.util';
import { ThemedLoadingComponent } from '../shared/loading/themed-loading.component';
import { ThemedLogInComponent } from '../shared/log-in/themed-log-in.component';

/**
 * This component represents the login page
 */
@Component({

  selector: 'ds-base-login-page',
  styleUrls: ['./login-page.component.scss'],
  templateUrl: './login-page.component.html',
  standalone: true,
  imports: [ThemedLoadingComponent, ThemedLogInComponent, TranslateModule, NgIf],
})
export class LoginPageComponent implements OnDestroy, OnInit {

  /**
   * Whether a platform id represents a browser platform.
   */
  isPlatformBrowser: boolean;

  /**
   * Subscription to unsubscribe onDestroy
   * @type {Subscription}
   */
  sub: Subscription;

  /**
   * Initialize instance variables
   *
   * @param {PLATFORM_ID} platformId
   * @param {ActivatedRoute} route
   * @param {Store<AppState>} store
   */
  constructor(
    @Inject(PLATFORM_ID) protected platformId: string,
    private route: ActivatedRoute,
    private store: Store<AppState>,
  ) {
    this.isPlatformBrowser = isPlatformBrowser(this.platformId);
  }

  /**
   * Initialize instance variables
   */
  ngOnInit() {
    if (this.isPlatformBrowser) {
      const queryParamsObs = this.route.queryParams;
      const authenticated = this.store.select(isAuthenticated);
      this.sub = observableCombineLatest([queryParamsObs, authenticated]).pipe(
        filter(([params, auth]) => isNotEmpty(params.token) || isNotEmpty(params.expired)),
        take(1),
      ).subscribe(([params, auth]) => {
        const token = params.token;
        let authToken: AuthTokenInfo;
        if (!auth) {
          if (isNotEmpty(token)) {
            authToken = new AuthTokenInfo(token);
            this.store.dispatch(new AuthenticatedAction(authToken));
          } else if (isNotEmpty(params.expired)) {
            this.store.dispatch(new AddAuthenticationMessageAction('auth.messages.expired'));
          }
        } else {
          if (isNotEmpty(token)) {
            authToken = new AuthTokenInfo(token);
            this.store.dispatch(new AuthenticationSuccessAction(authToken));
          }
        }
      });
    }
  }

  /**
   * Unsubscribe from subscription
   */
  ngOnDestroy() {
    if (hasValue(this.sub)) {
      this.sub.unsubscribe();
    }
    // Clear all authentication messages when leaving login page
    this.store.dispatch(new ResetAuthenticationMessagesAction());
  }
}
