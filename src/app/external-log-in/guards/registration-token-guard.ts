import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { EpersonRegistrationService } from '@dspace/core/data/eperson-registration.service';
import { RemoteData } from '@dspace/core/data/remote-data';
import { getFirstCompletedRemoteData } from '@dspace/core/shared/operators';
import { Registration } from '@dspace/core/shared/registration.model';
import { hasValue } from '@dspace/shared/utils/empty.util';
import {
  map,
  Observable,
  of,
} from 'rxjs';

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
