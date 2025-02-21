import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';

import { followLink } from '@dspace/core';
import { ProcessDataService } from '@dspace/core';
import { RemoteData } from '@dspace/core';
import { Process } from '@dspace/core';
import { getFirstCompletedRemoteData } from '@dspace/core';

export const PROCESS_PAGE_FOLLOW_LINKS = [
  followLink('files'),
];

/**
 * Method for resolving a process based on the parameters in the current route
 * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
 * @param {RouterStateSnapshot} state The current RouterStateSnapshot
 * @param {ProcessDataService} processService
 * @returns Observable<<RemoteData<Process>> Emits the found process based on the parameters in the current route,
 * or an error if something went wrong
 */
export const processPageResolver: ResolveFn<RemoteData<Process>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  processService: ProcessDataService = inject(ProcessDataService),
): Observable<RemoteData<Process>> => {
  return processService.findById(route.params.id, false, true, ...PROCESS_PAGE_FOLLOW_LINKS).pipe(
    getFirstCompletedRemoteData(),
  );
};
