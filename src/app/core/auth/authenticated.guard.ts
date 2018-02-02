import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

// reducers
import {
  isAuthenticated,
  State
} from '../app.reducers';

/**
 * Prevent unauthorized activating and loading of routes
 * @class AuthenticatedGuard
 */
@Injectable()
export class AuthenticatedGuard implements CanActivate, CanLoad {

  /**
   * @constructor
   */
  constructor(private router: Router, private store: Store<State>) {}

  /**
   * True when user is authenticated
   * @method canActivate
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    // get observable
    const observable = this.store.select(isAuthenticated);

    // redirect to sign in page if user is not authenticated
    observable.subscribe((authenticated) => {
      if (!authenticated) {
        this.router.navigate(['/login']);
      }
    });

    return observable;
  }

  /**
   * True when user is authenticated
   * @method canLoad
   */
  canLoad(route: Route): Observable<boolean> | Promise<boolean> | boolean {
    // get observable
    const observable = this.store.select(isAuthenticated);

    // redirect to sign in page if user is not authenticated
    observable.subscribe((authenticated) => {
      if (!authenticated) {
        this.router.navigate(['/login']);
      }
    });

    return observable;
  }
}
