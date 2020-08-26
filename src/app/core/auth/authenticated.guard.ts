import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Route,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';

import { CoreState } from '../core.reducers';
import { isAuthenticated } from './selectors';
import { AuthService, LOGIN_ROUTE } from './auth.service';

/**
 * Prevent unauthorized activating and loading of routes
 * @class AuthenticatedGuard
 */
@Injectable()
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
    // get observable
    const observable = this.store.pipe(select(isAuthenticated));

    // redirect to sign in page if user is not authenticated
    return observable.pipe(
      map((authenticated) => {
        if (authenticated) {
          return authenticated;
        } else {
          this.authService.setRedirectUrl(url);
          this.authService.removeToken();
          return this.router.createUrlTree([LOGIN_ROUTE]);
        }
      })
    );
  }
}
