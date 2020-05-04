import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';

import { CoreState } from '../core.reducers';
import { isAuthenticated } from './selectors';
import { AuthService } from './auth.service';
import { RedirectWhenAuthenticationIsRequiredAction } from './auth.actions';

/**
 * Prevent unauthorized activating and loading of routes
 * @class AuthenticatedGuard
 */
@Injectable()
export class AuthenticatedGuard implements CanActivate, CanLoad {

  /**
   * @constructor
   */
  constructor(private authService: AuthService, private router: Router, private store: Store<CoreState>) {}

  /**
   * True when user is authenticated
   * @method canActivate
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const url = state.url;
    return this.handleAuth(url);
  }

  /**
   * True when user is authenticated
   * @method canActivateChild
   */
  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.canActivate(route, state);
  }

  /**
   * True when user is authenticated
   * @method canLoad
   */
  canLoad(route: Route): Observable<boolean> {
    const url = `/${route.path}`;

    return this.handleAuth(url);
  }

  private handleAuth(url: string): Observable<boolean> {
    // get observable
    const observable = this.store.pipe(select(isAuthenticated));

    // redirect to sign in page if user is not authenticated
    observable.pipe(
      // .filter(() => isEmpty(this.router.routerState.snapshot.url) || this.router.routerState.snapshot.url === url)
      take(1))
      .subscribe((authenticated) => {
        if (!authenticated) {
          this.authService.setRedirectUrl(url);
          this.store.dispatch(new RedirectWhenAuthenticationIsRequiredAction('Login required'));
        }
    });

    return observable;
  }
}
