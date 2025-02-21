import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';

import { EpersonRegistrationService } from '../../../modules/core/src/lib/core/data/eperson-registration.service';
import { RemoteData } from '../../../modules/core/src/lib/core/data/remote-data';
import { getFirstCompletedRemoteData } from '../../../modules/core/src/lib/core/shared/operators';
import { Registration } from '../../../modules/core/src/lib/core/shared/registration.model';

export const registrationResolver: ResolveFn<RemoteData<Registration>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  epersonRegistrationService: EpersonRegistrationService = inject(EpersonRegistrationService),
): Observable<RemoteData<Registration>> => {
  const token = route.params.token;
  return epersonRegistrationService.searchByToken(token).pipe(
    getFirstCompletedRemoteData(),
  );
};
