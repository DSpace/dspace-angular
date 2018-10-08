import { of as observableOf, Observable } from 'rxjs';

import { map, filter } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { RouterReducerState } from '@ngrx/router-store';
import { select, Store } from '@ngrx/store';

import { fadeInOut, fadeOut } from '../animations/fade';
import { HostWindowService } from '../host-window.service';
import { AppState, routerStateSelector } from '../../app.reducer';
import { isNotUndefined } from '../empty.util';
import {
  getAuthenticatedUser,
  isAuthenticated,
  isAuthenticationLoading
} from '../../core/auth/selectors';
import { EPerson } from '../../core/eperson/models/eperson.model';
import { AuthService, LOGIN_ROUTE, LOGOUT_ROUTE } from '../../core/auth/auth.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'ds-auth-nav-menu',
  templateUrl: './auth-nav-menu.component.html',
  styleUrls: ['./auth-nav-menu.component.scss'],
  animations: [fadeInOut, fadeOut]
})
export class AuthNavMenuComponent implements OnInit {
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

  public isXsOrSm$: Observable<boolean>;

  public showAuth = observableOf(false);

  public user: Observable<EPerson>;

  public sub: Subscription;

  constructor(private store: Store<AppState>,
              private windowService: HostWindowService,
              private authService: AuthService
  ) {
    this.isXsOrSm$ = this.windowService.isXsOrSm();
  }

  ngOnInit(): void {
    // set isAuthenticated
    this.isAuthenticated = this.store.pipe(select(isAuthenticated));

    // set loading
    this.loading = this.store.pipe(select(isAuthenticationLoading));

    this.user = this.store.pipe(select(getAuthenticatedUser));

    this.showAuth = this.store.select(routerStateSelector)
      .filter((router: RouterReducerState) => isNotUndefined(router) && isNotUndefined(router.state))
      .map((router: RouterReducerState) => {
        const url = router.state.url;
        const show = !router.state.url.startsWith(LOGIN_ROUTE) && !router.state.url.startsWith(LOGOUT_ROUTE);
        if (show) {
          this.authService.setRedirectUrl(url);
        }
        return show;
      });
  }
}
