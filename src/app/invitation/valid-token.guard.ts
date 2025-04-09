import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import {
  Observable,
  of,
} from 'rxjs';
import {
  map,
  tap,
} from 'rxjs/operators';

import { EpersonRegistrationService } from '../core/data/eperson-registration.service';
import { RemoteData } from '../core/data/remote-data';
import { getFirstCompletedRemoteData } from '../core/shared/operators';
import { Registration } from '../core/shared/registration.model';
import { hasValue } from '../shared/empty.util';

export const validTokenGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): Observable<boolean | UrlTree> => {
  const router = inject(Router);
  const epersonRegistrationService = inject(EpersonRegistrationService);

  if (route.params.registrationToken) {
    return epersonRegistrationService
      .searchRegistrationByToken(route.params.registrationToken)
      .pipe(
        getFirstCompletedRemoteData(),
        map((data: RemoteData<Registration>) => data.hasSucceeded && hasValue('groupNames') && data.payload.groupNames.length > 0),
        tap((isValid: boolean) => {
          if (!isValid) {
            router.navigate(['/404']);
          }
        }),
      );
  } else {
    router.navigate(['/404']);
    return of(false);
  }
};
