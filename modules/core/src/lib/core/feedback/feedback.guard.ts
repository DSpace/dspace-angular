import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';

import { AuthorizationDataService } from '../data';
import { FeatureID } from '../data';

/**
 * A guard for redirecting users to the feedback page if user is authorized
 */
export const feedbackGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  authorizationService: AuthorizationDataService = inject(AuthorizationDataService),
): Observable<boolean | UrlTree> => {
  return authorizationService.isAuthorized(FeatureID.CanSendFeedback);
};

