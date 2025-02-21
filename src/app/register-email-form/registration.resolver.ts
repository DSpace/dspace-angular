import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';

import { EpersonRegistrationService } from '@dspace/core';
import { RemoteData } from '@dspace/core';
import { getFirstCompletedRemoteData } from '@dspace/core';
import { Registration } from '@dspace/core';

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
