import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { of as observableOf } from 'rxjs';

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
      return observableOf(endUserAgreementService.isCookieAccepted());
    },
  );
