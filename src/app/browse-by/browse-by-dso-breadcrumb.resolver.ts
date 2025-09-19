import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { DSOBreadcrumbsService } from '@dspace/core/breadcrumbs/dso-breadcrumbs.service';
import { BreadcrumbConfig } from '@dspace/core/breadcrumbs/models/breadcrumb-config.model';
import { DSpaceObjectDataService } from '@dspace/core/data/dspace-object-data.service';
import { getDSORoute } from '@dspace/core/router/utils/dso-route.utils';
import { Collection } from '@dspace/core/shared/collection.model';
import { Community } from '@dspace/core/shared/community.model';
import {
  getFirstSucceededRemoteData,
  getRemoteDataPayload,
} from '@dspace/core/shared/operators';
import { hasValue } from '@dspace/shared/utils/empty.util';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
