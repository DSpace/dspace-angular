import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { APP_CONFIG } from '@dspace/config';
import { EndUserAgreementService } from '@dspace/core';
import { of } from 'rxjs';

import { endUserAgreementGuard } from './end-user-agreement.guard';


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

      return endUserAgreementService.hasCurrentUserAcceptedAgreement(true);
    },
  );
