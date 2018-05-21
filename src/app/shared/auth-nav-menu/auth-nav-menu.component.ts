import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { RouterReducerState } from '@ngrx/router-store';
import { Store } from '@ngrx/store';

import { fadeInOut, fadeOut } from '../animations/fade';
import { HostWindowService } from '../host-window.service';
import { AppState, routerStateSelector } from '../../app.reducer';
import { isNotUndefined } from '../empty.util';
import { getAuthenticatedUser, isAuthenticated, isAuthenticationLoading } from '../../core/auth/selectors';
import { Eperson } from '../../core/eperson/models/eperson.model';
import { LOGIN_ROUTE, LOGOUT_ROUTE } from '../../core/auth/auth.service';

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

  public showAuth = Observable.of(false);

  public user: Observable<Eperson>;

  constructor(private store: Store<AppState>,
              public windowService: HostWindowService) {
  }

  ngOnInit(): void {
    // set isAuthenticated
    this.isAuthenticated = this.store.select(isAuthenticated);

    // set loading
    this.loading = this.store.select(isAuthenticationLoading);

    this.user = this.store.select(getAuthenticatedUser);

    this.showAuth = this.store.select(routerStateSelector)
      .filter((router: RouterReducerState) => isNotUndefined(router) && isNotUndefined(router.state))
      .map((router: RouterReducerState) => {
        return !router.state.url.startsWith(LOGIN_ROUTE) && !router.state.url.startsWith(LOGOUT_ROUTE);
      });
  }
}
