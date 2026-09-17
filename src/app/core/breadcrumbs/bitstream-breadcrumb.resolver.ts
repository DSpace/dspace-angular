import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';

import { BitstreamDataService } from '../data/bitstream-data.service';
import {
  Bitstream,
  BITSTREAM_PAGE_LINKS_TO_FOLLOW,
} from '../shared/bitstream.model';
import { DSpaceObject } from '../shared/dspace-object.model';
import { FollowLinkConfig } from '../shared/follow-link-config.model';
import { BitstreamBreadcrumbsService } from './bitstream-breadcrumbs.service';
import { DSOBreadcrumbResolver } from './dso-breadcrumb.resolver';
import { BreadcrumbConfig } from './models/breadcrumb-config.model';

/**
 * The resolve function that resolves the BreadcrumbConfig object for an Item
 */
export const bitstreamBreadcrumbResolver: ResolveFn<BreadcrumbConfig<Bitstream>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  breadcrumbService: BitstreamBreadcrumbsService = inject(BitstreamBreadcrumbsService),
  dataService: BitstreamDataService = inject(BitstreamDataService),
): Observable<BreadcrumbConfig<Bitstream>> => {
  const linksToFollow: FollowLinkConfig<DSpaceObject>[] = BITSTREAM_PAGE_LINKS_TO_FOLLOW as FollowLinkConfig<DSpaceObject>[];
  return DSOBreadcrumbResolver(
    route,
    state,
    breadcrumbService,
    dataService,
    ...linksToFollow,
  ) as Observable<BreadcrumbConfig<Bitstream>>;
};

