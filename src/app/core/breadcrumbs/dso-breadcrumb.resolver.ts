import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BreadcrumbConfig } from '../../breadcrumbs/breadcrumb/breadcrumb-config.model';
import { hasValue } from '../../shared/empty.util';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { IdentifiableDataService } from '../data/base/identifiable-data.service';
import { DSpaceObject } from '../shared/dspace-object.model';
import {
  getFirstCompletedRemoteData,
  getRemoteDataPayload,
} from '../shared/operators';
import { DSOBreadcrumbsService } from './dso-breadcrumbs.service';

/**
 * Method for resolving a breadcrumb config object
 * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
 * @param {RouterStateSnapshot} state The current RouterStateSnapshot
 * @param {DSOBreadcrumbsService} breadcrumbService
 * @param {IdentifiableDataService} dataService
 * @param linksToFollow
 * @returns BreadcrumbConfig object
 */
export const DSOBreadcrumbResolver: (route: ActivatedRouteSnapshot, state: RouterStateSnapshot, breadcrumbService: DSOBreadcrumbsService, dataService: IdentifiableDataService<DSpaceObject>, ...linksToFollow: FollowLinkConfig<DSpaceObject>[]) => Observable<BreadcrumbConfig<DSpaceObject>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  breadcrumbService: DSOBreadcrumbsService,
  dataService: IdentifiableDataService<DSpaceObject>,
  ...linksToFollow: FollowLinkConfig<DSpaceObject>[]
): Observable<BreadcrumbConfig<DSpaceObject>> => {
  const uuid = route.params.id;
  return dataService.findById(uuid, true, false, ...linksToFollow).pipe(
    getFirstCompletedRemoteData(),
    getRemoteDataPayload(),
    map((object: DSpaceObject) => {
      if (hasValue(object)) {
        const fullPath = state.url;
        const url = (fullPath.substring(0, fullPath.indexOf(uuid))).concat(uuid);
        return { provider: breadcrumbService, key: object, url: url };
      } else {
        return undefined;
      }
    }),
  );
};
