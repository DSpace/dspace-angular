import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BreadcrumbConfig } from '@dspace/core';
import { followLink } from '@dspace/core';
import { ProcessDataService } from '@dspace/core';
import { RemoteData } from '@dspace/core';
import { Process } from '@dspace/core';
import { getFirstCompletedRemoteData } from '@dspace/core';
import { ProcessBreadcrumbsService } from './process-breadcrumbs.service';

/**
 * Method for resolving a process based on the parameters in the current route
 * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
 * @param {RouterStateSnapshot} state The current RouterStateSnapshot
 * @param breadcrumbService
 * @param processService
 * @returns Observable<<RemoteData<Process>> Emits the found process based on the parameters in the current route,
 * or an error if something went wrong
 */
export const processBreadcrumbResolver: ResolveFn<BreadcrumbConfig<Process>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  breadcrumbService: ProcessBreadcrumbsService = inject(ProcessBreadcrumbsService),
  processService: ProcessDataService = inject(ProcessDataService),
): Observable<BreadcrumbConfig<Process>> => {
  const id = route.params.id;

  return processService.findById(route.params.id, true, false, followLink('script')).pipe(
    getFirstCompletedRemoteData(),
    map((object: RemoteData<Process>) => {
      const fullPath = state.url;
      const url = fullPath.substring(0, fullPath.indexOf(id)).concat(id);
      return { provider: breadcrumbService, key: object.payload, url: url };
    }),
  );
};
