import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { hasValue } from '@dspace/shared/utils';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { getDSORoute } from '../app-routing-paths';
import { BreadcrumbConfig } from '../../../modules/core/src/lib/core/breadcrumbs/breadcrumb-config.model';
import { DSOBreadcrumbsService } from '../../../modules/core/src/lib/core/breadcrumbs/dso-breadcrumbs.service';
import { DSpaceObjectDataService } from '../../../modules/core/src/lib/core/data/dspace-object-data.service';
import { Collection } from '../../../modules/core/src/lib/core/shared/collection.model';
import { Community } from '../../../modules/core/src/lib/core/shared/community.model';
import {
  getFirstSucceededRemoteData,
  getRemoteDataPayload,
} from '../../../modules/core/src/lib/core/shared/operators';

/**
 * Method for resolving a breadcrumb config object
 * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
 * @param {RouterStateSnapshot} state The current RouterStateSnapshot
 * @param {DSOBreadcrumbsService} breadcrumbService
 * @param {DSpaceObjectDataService} dataService
 * @returns BreadcrumbConfig object
 */
export const browseByDSOBreadcrumbResolver: ResolveFn<BreadcrumbConfig<Community | Collection>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  breadcrumbService: DSOBreadcrumbsService = inject(DSOBreadcrumbsService),
  dataService: DSpaceObjectDataService = inject(DSpaceObjectDataService),
): Observable<BreadcrumbConfig<Community | Collection>> => {
  const uuid = route.queryParams.scope;
  if (hasValue(uuid)) {
    return dataService.findById(uuid).pipe(
      getFirstSucceededRemoteData(),
      getRemoteDataPayload(),
      map((object: Community | Collection) => {
        return { provider: breadcrumbService, key: object, url: getDSORoute(object) };
      }),
    );
  }
  return undefined;
};
