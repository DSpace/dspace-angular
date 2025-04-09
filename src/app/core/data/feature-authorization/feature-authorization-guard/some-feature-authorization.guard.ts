import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import {
  combineLatest as observableCombineLatest,
  Observable,
  of as observableOf,
} from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { AuthService } from '../../../auth/auth.service';
import { returnForbiddenUrlTreeOrLoginOnAllFalse } from '../../../shared/authorized.operators';
import { AuthorizationDataService } from '../authorization-data.service';
import { FeatureID } from '../feature-id';

export declare type SomeFeatureGuardParamFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => Observable<FeatureID[]>;
export declare type StringGuardParamFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => Observable<string>;
export const defaultStringGuardParamFn = () => observableOf(undefined);

/**
 * Guard for preventing unauthorized activating and loading of routes when a user doesn't have
 * authorized rights on any of the specified features and/or object.

 * @param getFeatureIDs   The features to check authorization for
 * @param getObjectUrl    The URL of the object to check if the user has authorized rights for,
 *                        Optional, if not provided, the {@link Site}'s URL will be assumed
 * @param getEPersonUuid  The UUID of the user to check authorization rights for.
 *                        Optional, if not provided, the authenticated user's UUID will be assumed.
 */
export const someFeatureAuthorizationGuard = (
  getFeatureIDs: SomeFeatureGuardParamFn,
  getObjectUrl: StringGuardParamFn = defaultStringGuardParamFn,
  getEPersonUuid: StringGuardParamFn = defaultStringGuardParamFn,
): CanActivateFn => {
  return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> => {
    const authorizationService = inject(AuthorizationDataService);
    const router = inject(Router);
    const authService = inject(AuthService);
    return observableCombineLatest([
      getFeatureIDs(route, state),
      getObjectUrl(route, state),
      getEPersonUuid(route, state),
    ]).pipe(
      switchMap(([featureIDs, objectUrl, ePersonUuid]: [FeatureID[], string, string]) =>
        observableCombineLatest(featureIDs.map((featureID) => authorizationService.isAuthorized(featureID, objectUrl, ePersonUuid))),
      ),
      returnForbiddenUrlTreeOrLoginOnAllFalse(router, authService, state.url),
    );
  };
};

