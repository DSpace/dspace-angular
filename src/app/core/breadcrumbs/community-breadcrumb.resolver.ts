import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { hasValue } from '@dspace/shared/utils/empty.util';
import { Observable } from 'rxjs';

import { CommunityDataService } from '../data/community-data.service';
import {
  Community,
  COMMUNITY_PAGE_LINKS_TO_FOLLOW,
} from '../shared/community.model';
import { DSpaceObject } from '../shared/dspace-object.model';
import { FollowLinkConfig } from '../shared/follow-link-config.model';
import {
  DSOBreadcrumbResolver,
  DSOBreadcrumbResolverByUuid,
} from './dso-breadcrumb.resolver';
import { DSOBreadcrumbsService } from './dso-breadcrumbs.service';
import { BreadcrumbConfig } from './models/breadcrumb-config.model';

/**
 * The resolve function that resolves the BreadcrumbConfig object for a Community
 */
export const communityBreadcrumbResolver: ResolveFn<BreadcrumbConfig<Community>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  breadcrumbService: DSOBreadcrumbsService = inject(DSOBreadcrumbsService),
  dataService: CommunityDataService = inject(CommunityDataService),
): Observable<BreadcrumbConfig<Community>> => {
  const linksToFollow: FollowLinkConfig<DSpaceObject>[] = COMMUNITY_PAGE_LINKS_TO_FOLLOW as FollowLinkConfig<DSpaceObject>[];
  if (hasValue(route.data.breadcrumbQueryParam) && hasValue(route.queryParams[route.data.breadcrumbQueryParam])) {
    return DSOBreadcrumbResolverByUuid(
      route,
      state,
      route.queryParams[route.data.breadcrumbQueryParam],
      breadcrumbService,
      dataService,
      ...linksToFollow,
    ) as Observable<BreadcrumbConfig<Community>>;
  } else {
    return DSOBreadcrumbResolver(
      route,
      state,
      breadcrumbService,
      dataService,
      ...linksToFollow,
    ) as Observable<BreadcrumbConfig<Community>>;
  }
};
