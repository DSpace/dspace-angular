import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
} from '@angular/router';
import {
  select,
  Store,
} from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  take,
} from 'rxjs/operators';

import { AppState } from '../../app.reducer';
import { isAuthenticationBlocking } from './selectors';

/**
 * A guard that blocks the loading of any
 * route until the authentication status has loaded.
 * To ensure all rest requests get the correct auth header.
 */
export const authBlockingGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  store: Store<AppState> = inject(Store<AppState>),
): Observable<boolean> => {
  return store.pipe(select(isAuthenticationBlocking)).pipe(
    map((isBlocking: boolean) => isBlocking === false),
    distinctUntilChanged(),
    filter((finished: boolean) => finished === true),
    take(1),
  );
};

