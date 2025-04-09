import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { map } from 'rxjs/operators';

import { endUserAgreementGuard } from './end-user-agreement.guard';
import { EndUserAgreementService } from './end-user-agreement.service';


/**
 * Guard for preventing unauthorized access to certain pages
 * requiring the end user agreement to have been accepted in a cookie
 */
export const endUserAgreementCookieGuard: CanActivateFn =
  endUserAgreementGuard(
    () => {
      const endUserAgreementService = inject(EndUserAgreementService);
      return endUserAgreementService.isUserAgreementEnabled().pipe(
        map((isUserAgreementEnabled) => isUserAgreementEnabled ? endUserAgreementService.isCookieAccepted() : true));
    },
  );
