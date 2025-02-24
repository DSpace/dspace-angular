import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import {
  EpersonRegistrationService,
  getFirstCompletedRemoteData,
  Registration,
  RemoteData,
} from '@dspace/core';
import { Observable } from 'rxjs';

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
