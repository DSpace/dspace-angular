import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import {
  map,
  Observable,
  of,
} from 'rxjs';

import { EpersonRegistrationService } from '../../core/data/eperson-registration.service';
import { RemoteData } from '../../core/data/remote-data';
import { getFirstCompletedRemoteData } from '../../core/shared/operators';
import { Registration } from '../../core/shared/registration.model';
import { hasValue } from '../../shared/empty.util';

/**
 * Determines if a user can activate a route based on the registration token.
 * @param route - The activated route snapshot.
 * @param state - The router state snapshot.
 * @param epersonRegistrationService - The eperson registration service.
 * @param router - The router.
 * @returns A value indicating if the user can activate the route.
 */
export const registrationTokenGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): Observable<boolean> => {
  const epersonRegistrationService = inject(EpersonRegistrationService);
  const router = inject(Router);
  if (route.params.token) {
    return epersonRegistrationService
      .searchByTokenAndHandleError(route.params.token)
      .pipe(
        getFirstCompletedRemoteData(),
        map(
          (data: RemoteData<Registration>) => {
            if (data.hasSucceeded && hasValue(data)) {
              return true;
            } else {
              router.navigate(['/404']);
            }
          },
        ),
      );
  } else {
    router.navigate(['/404']);
    return of(false);
  }
};
