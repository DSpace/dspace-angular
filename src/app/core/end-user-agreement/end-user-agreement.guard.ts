import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { APP_CONFIG } from '@config/app-config.interface';
import {
  Observable,
  of,
} from 'rxjs';

import { returnEndUserAgreementUrlTreeOnFalse } from '../shared/authorized.operators';

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
