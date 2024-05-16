import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { getDSORoute } from '../../app-routing-paths';
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
  return DSOBreadcrumbResolverByUuid(route, state, route.params.id, breadcrumbService, dataService, ...linksToFollow);
};

/**
 * Method for resolving a breadcrumb config object with the given UUID
 *
 * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
 * @param {RouterStateSnapshot} state The current RouterStateSnapshot
 * @param {String} uuid The uuid of the DSO object
 * @param {DSOBreadcrumbsService} breadcrumbService
 * @param {IdentifiableDataService} dataService
 * @param linksToFollow
 * @returns BreadcrumbConfig object
 */
export const DSOBreadcrumbResolverByUuid: (route: ActivatedRouteSnapshot, state: RouterStateSnapshot, uuid: string, breadcrumbService: DSOBreadcrumbsService, dataService: IdentifiableDataService<DSpaceObject>, ...linksToFollow: FollowLinkConfig<DSpaceObject>[]) => Observable<BreadcrumbConfig<DSpaceObject>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  uuid: string,
  breadcrumbService: DSOBreadcrumbsService,
  dataService: IdentifiableDataService<DSpaceObject>,
  ...linksToFollow: FollowLinkConfig<DSpaceObject>[]
): Observable<BreadcrumbConfig<DSpaceObject>> => {
  return dataService.findById(uuid, true, false, ...linksToFollow).pipe(
    getFirstCompletedRemoteData(),
    getRemoteDataPayload(),
    map((object: DSpaceObject) => {
      if (hasValue(object)) {
        return { provider: breadcrumbService, key: object, url: getDSORoute(object) };
      } else {
        return undefined;
      }
    }),
  );
};
