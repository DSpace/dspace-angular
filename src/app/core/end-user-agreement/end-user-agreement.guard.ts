import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { APP_CONFIG } from '@dspace/config/app-config.interface';
import {
  Observable,
  of,
} from 'rxjs';
import { map } from 'rxjs/operators';

import { getEndUserAgreementPath } from '../router/info-routing-paths';

export declare type HasAcceptedGuardParamFn = () => Observable<boolean>;
/**
 * Guard for preventing activating when the user has not accepted the EndUserAgreement
 * @param hasAccepted Function determining if the EndUserAgreement has been accepted
 */
export const endUserAgreementGuard = (
  hasAccepted: HasAcceptedGuardParamFn,
): CanActivateFn => {
  return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> => {
    const router = inject(Router);
    if (!inject(APP_CONFIG).info.enableEndUserAgreement) {
      return of(true);
    }
    return hasAccepted().pipe(
      returnEndUserAgreementUrlTreeOnFalse(router, state.url),
    );
  };
};

/**
 * Operator that returns a UrlTree to the unauthorized page when the boolean received is false
 * @param router    Router
 * @param redirect  Redirect URL to add to the UrlTree. This is used to redirect back to the original route after the
 *                  user accepts the agreement.
 */
export const returnEndUserAgreementUrlTreeOnFalse = (router: Router, redirect: string) =>
  (source: Observable<boolean>): Observable<boolean | UrlTree> =>
    source.pipe(
      map((hasAgreed: boolean) => {
        const queryParams = { redirect: encodeURIComponent(redirect) };
        return hasAgreed ? hasAgreed : router.createUrlTree([getEndUserAgreementPath()], { queryParams });
      }),
    );
