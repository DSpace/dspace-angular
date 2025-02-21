import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BreadcrumbConfig } from '../../../modules/core/src/lib/core/breadcrumbs/breadcrumb-config.model';
import { followLink } from '../../../modules/core/src/lib/core/data/follow-link-config.model';
import { ProcessDataService } from '../../../modules/core/src/lib/core/data/processes/process-data.service';
import { RemoteData } from '../../../modules/core/src/lib/core/data/remote-data';
import { Process } from '../../../modules/core/src/lib/core/processes/process.model';
import { getFirstCompletedRemoteData } from '../../../modules/core/src/lib/core/shared/operators';
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
