import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { APP_CONFIG } from '@dspace/config/app-config.interface';
import { of } from 'rxjs';
import { take } from 'rxjs/operators';

import { endUserAgreementGuard } from './end-user-agreement.guard';
import { EndUserAgreementService } from './end-user-agreement.service';


/**
 * Guard for preventing unauthorized access to certain pages
 * requiring the end user agreement to have been accepted by the current user

 */
export const endUserAgreementCurrentUserGuard: CanActivateFn =
  endUserAgreementGuard(
    () => {
      const endUserAgreementService = inject(EndUserAgreementService);
      if (!inject(APP_CONFIG).info.enableEndUserAgreement) {
        return of(true);
      }

      // Use hasCurrentUserOrCookieAcceptedAgreement to leverage synchronous cookie check
      // This prevents guard hangs after PATCH operations when store cache may be stale
      return endUserAgreementService.hasCurrentUserOrCookieAcceptedAgreement(true).pipe(
        take(1),
      );
    },
  );
