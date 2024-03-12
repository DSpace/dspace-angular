import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import {
  select,
  Store,
} from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  find,
  map,
  switchMap,
} from 'rxjs/operators';

import { CoreState } from '../core-state.model';
import {
  AuthService,
  LOGIN_ROUTE,
} from './auth.service';
import {
  isAuthenticated,
  isAuthenticationLoading,
} from './selectors';

/**
 * Prevent unauthorized activating and loading of routes
 * @class AuthenticatedGuard
 */
@Injectable({ providedIn: 'root' })
export class AuthenticatedGuard implements CanActivate {

  /**
   * @constructor
   */
  constructor(private authService: AuthService, private router: Router, private store: Store<CoreState>) {}

  /**
   * True when user is authenticated
   * UrlTree with redirect to login page when user isn't authenticated
   * @method canActivate
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    const url = state.url;
    return this.handleAuth(url);
  }

  /**
   * True when user is authenticated
   * UrlTree with redirect to login page when user isn't authenticated
   * @method canActivateChild
   */
  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    return this.canActivate(route, state);
  }

  private handleAuth(url: string): Observable<boolean | UrlTree> {
    // redirect to sign in page if user is not authenticated
    return this.store.pipe(select(isAuthenticationLoading)).pipe(
      find((isLoading: boolean) => isLoading === false),
      switchMap(() => this.store.pipe(select(isAuthenticated))),
      map((authenticated) => {
        if (authenticated) {
          return authenticated;
        } else {
          this.authService.setRedirectUrl(url);
          this.authService.removeToken();
          return this.router.createUrlTree([LOGIN_ROUTE]);
        }
      }),
    );
  }
}
