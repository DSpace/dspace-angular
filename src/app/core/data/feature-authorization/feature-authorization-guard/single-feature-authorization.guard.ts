import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { FeatureID } from '../feature-id';
import {
  someFeatureAuthorizationGuard,
  StringGuardParamFn,
} from './some-feature-authorization.guard';

export declare type SingleFeatureGuardParamFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => Observable<FeatureID>;

/**
 * Guard for preventing unauthorized activating and loading of routes when a user doesn't have
 * authorized rights on a specific feature and/or object.
 *
 * @param getFeatureID    The feature to check authorization for
 * @param getObjectUrl    The URL of the object to check if the user has authorized rights for,
 *                        Optional, if not provided, the {@link Site}'s URL will be assumed
 * @param getEPersonUuid  The UUID of the user to check authorization rights for.
 *                        Optional, if not provided, the authenticated user's UUID will be assumed.
 */

export const singleFeatureAuthorizationGuard = (
  getFeatureID: SingleFeatureGuardParamFn,
  getObjectUrl?: StringGuardParamFn,
  getEPersonUuid?: StringGuardParamFn,
): CanActivateFn => someFeatureAuthorizationGuard(
  (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<FeatureID[]> => getFeatureID(route, state).pipe(
    map((featureID: FeatureID) => [featureID]),
  ), getObjectUrl, getEPersonUuid);
