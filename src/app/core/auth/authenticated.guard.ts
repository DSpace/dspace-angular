import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateChildFn,
  CanActivateFn,
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

import { AppState } from '../../app.reducer';
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
 * True when user is authenticated
 * UrlTree with redirect to login page when user isn't authenticated
 * @method canActivate
 */
export const authenticatedGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  authService: AuthService = inject(AuthService),
  router: Router = inject(Router),
  store: Store<AppState> = inject(Store<AppState>),
): Observable<boolean | UrlTree> => {
  const url = state.url;
  // redirect to sign in page if user is not authenticated
  return store.pipe(select(isAuthenticationLoading)).pipe(
    find((isLoading: boolean) => isLoading === false),
    switchMap(() => store.pipe(select(isAuthenticated))),
    map((authenticated) => {
      if (authenticated) {
        return authenticated;
      } else {
        authService.setRedirectUrl(url);
        authService.removeToken();
        return router.createUrlTree([LOGIN_ROUTE]);
      }
    }),
  );
};

export const AuthenticatedGuardChild: CanActivateChildFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => authenticatedGuard(route, state);
