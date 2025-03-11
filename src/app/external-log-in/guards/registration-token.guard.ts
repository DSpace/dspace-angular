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
import { map } from 'rxjs/operators';
import { AuthRegistrationType } from 'src/app/core/auth/models/auth.registration-type';

import { EpersonRegistrationService } from '../../core/data/eperson-registration.service';
import { RemoteData } from '../../core/data/remote-data';
import { getFirstCompletedRemoteData } from '../../core/shared/operators';
import { Registration } from '../../core/shared/registration.model';
import { hasValue } from '../../shared/empty.util';

export const registrationTokenGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): Observable<boolean | UrlTree> => {
  const router = inject(Router);
  const epersonRegistrationService = inject(EpersonRegistrationService);

  if (route.params.token) {
    return epersonRegistrationService
      .searchRegistrationByToken(route.params.token)
      .pipe(
        getFirstCompletedRemoteData(),
        map((data: RemoteData<Registration>) => {
          if (data.hasSucceeded && hasValue(data.payload) && !data.payload.registrationType.includes(AuthRegistrationType.Validation)) {
            return true;
          } else {
            router.navigate(['/404']);
          }
        }),
      );
  } else {
    router.navigate(['/404']);
    return of(false);
  }
};
