import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { getForbiddenRoute } from '../../app-routing-paths';
import { OrcidAuthService } from '../../core/orcid/orcid-auth.service';

export const itemPageUnlinkOrcidGuard: CanActivateFn = (): Observable<boolean | UrlTree> => {
  const orcidAuthService = inject(OrcidAuthService);
  const router = inject(Router);

  return orcidAuthService.onlyAdminCanDisconnectProfileFromOrcid().pipe(
    map((canDisconnect) => {
      return canDisconnect ? true : router.parseUrl(getForbiddenRoute());
    }),
  );
};
