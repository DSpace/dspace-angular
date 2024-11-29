import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';

import { BITSTREAM_PAGE_LINKS_TO_FOLLOW } from '../../bitstream-page/bitstream-page.resolver';
import { BreadcrumbConfig } from '../../breadcrumbs/breadcrumb/breadcrumb-config.model';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { BitstreamDataService } from '../data/bitstream-data.service';
import { Bitstream } from '../shared/bitstream.model';
import { DSpaceObject } from '../shared/dspace-object.model';
import { BitstreamBreadcrumbsService } from './bitstream-breadcrumbs.service';
import { DSOBreadcrumbResolver } from './dso-breadcrumb.resolver';

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

