import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';

import { BreadcrumbConfig } from '../../breadcrumbs/breadcrumb/breadcrumb-config.model';
import { COMMUNITY_PAGE_LINKS_TO_FOLLOW } from '../../community-page/community-page.resolver';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { CommunityDataService } from '../data/community-data.service';
import { Community } from '../shared/community.model';
import { DSpaceObject } from '../shared/dspace-object.model';
import { DSOBreadcrumbResolver } from './dso-breadcrumb.resolver';
import { DSOBreadcrumbsService } from './dso-breadcrumbs.service';

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
  return DSOBreadcrumbResolver(
    route,
    state,
    breadcrumbService,
    dataService,
    ...linksToFollow,
  ) as Observable<BreadcrumbConfig<Community>>;
};
