import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import {
  catchError,
  mergeMap,
  Observable,
  of,
  tap,
} from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';
import { AuthRegistrationType } from '../../core/auth/models/auth.registration-type';
import { EpersonRegistrationService } from '../../core/data/eperson-registration.service';
import { RemoteData } from '../../core/data/remote-data';
import { getFirstCompletedRemoteData } from '../../core/shared/operators';
import { Registration } from '../../core/shared/registration.model';
import { hasValue } from '../../shared/empty.util';

/**
 * Determines if a user can activate a route based on the registration token.z
 * @param route - The activated route snapshot.
 * @param state - The router state snapshot.
 * @returns A value indicating if the user can activate the route.
 */
export const ReviewAccountGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): Observable<boolean> => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const epersonRegistrationService = inject(EpersonRegistrationService);
  if (route.params.token) {
    return epersonRegistrationService
      .searchByTokenAndHandleError(route.params.token)
      .pipe(
        getFirstCompletedRemoteData(),
        mergeMap(
          (data: RemoteData<Registration>) => {
            if (data.hasSucceeded && hasValue(data.payload)) {
              // is the registration type validation (account valid)
              if (hasValue(data.payload.registrationType) && data.payload.registrationType.includes(AuthRegistrationType.Validation)) {
                return of(true);
              } else {
                return authService.isAuthenticated();
              }
            }
            return of(false);
          },
        ),
        tap((isValid: boolean) => {
          if (!isValid) {
            router.navigate(['/404']);
          }
        }),
        catchError(() => {
          router.navigate(['/404']);
          return of(false);
        }),
      );
  } else {
    router.navigate(['/404']);
    return of(false);
  }
};
