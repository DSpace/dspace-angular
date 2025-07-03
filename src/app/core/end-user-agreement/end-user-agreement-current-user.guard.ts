import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { of } from 'rxjs';

import { environment } from '../../../environments/environment';
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
      if (!environment.info.enableEndUserAgreement) {
        return of(true);
      }

      return endUserAgreementService.hasCurrentUserAcceptedAgreement(true);
    },
  );
