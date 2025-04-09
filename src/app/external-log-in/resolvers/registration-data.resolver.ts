import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';

import { EpersonRegistrationService } from '../../core/data/eperson-registration.service';
import { RemoteData } from '../../core/data/remote-data';
import { getFirstCompletedRemoteData } from '../../core/shared/operators';
import { Registration } from '../../core/shared/registration.model';
import { hasValue } from '../../shared/empty.util';

export const registrationDataResolver: ResolveFn<RemoteData<Registration>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): Observable<RemoteData<Registration>> => {
  const epersonRegistrationService = inject(EpersonRegistrationService);
  const token = route.params.token;

  if (hasValue(token)) {
    return epersonRegistrationService.searchRegistrationByToken(token).pipe(
      getFirstCompletedRemoteData(),
    );
  }
};
