import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router,
  UrlTree,
} from '@angular/router';
import { APP_CONFIG } from '@dspace/config/app-config.interface';
import { of } from 'rxjs';
import {
  map,
  take,
} from 'rxjs/operators';

import { EndUserAgreementService } from './end-user-agreement.service';

export const endUserAgreementCurrentUserGuard: CanActivateFn = (route, state) => {
  const endUserAgreementService = inject(EndUserAgreementService);
  const router = inject(Router);
  const config = inject(APP_CONFIG);

  if (!config.info.enableEndUserAgreement) {
    return of(true);
  }

  return endUserAgreementService.hasCurrentUserOrCookieAcceptedAgreement(false).pipe(
    map(accepted => {
      if (accepted) {
        return true;
      }
      return router.createUrlTree(['/end-user-agreement'], {
        queryParams: { redirect: state.url },
      }) as UrlTree;
    }),
    take(1),
  );
};
