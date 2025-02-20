import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { of as observableOf } from 'rxjs';

import { APP_CONFIG } from '../config/app-config.interface';
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
      const appConfig = inject(APP_CONFIG);

      if (!appConfig.info.enableEndUserAgreement) {
        return observableOf(true);
      }

      return endUserAgreementService.hasCurrentUserAcceptedAgreement(true);
    },
  );
