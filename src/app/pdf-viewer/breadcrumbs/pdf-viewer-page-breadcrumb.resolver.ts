import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';

import { BreadcrumbConfig } from '../../core/breadcrumbs/models/breadcrumb-config.model';
import { DSOBreadcrumbResolver } from '../../core/breadcrumbs/dso-breadcrumb.resolver';
import { BitstreamDataService } from '../../core/data/bitstream-data.service';
import { Bitstream } from '../../core/shared/bitstream.model';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import {
  followLink,
  FollowLinkConfig,
} from '../../core/shared/follow-link-config.model';
import { PdfViewerPageBreadcrumbsService } from './pdf-viewer-page-breadcrumbs.service';

export const BITSTREAM_PAGE_LINKS_TO_FOLLOW: FollowLinkConfig<Bitstream>[] =
  [
    followLink('bundle', {},
      followLink('item', {},
        followLink('owningCollection', {},
          followLink('parentCommunity', {},
            followLink('parentCommunity'))))),
    followLink('format'),
  ];

export const pdfViewerPageBreadcrumbResolver: ResolveFn<BreadcrumbConfig<Bitstream>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  breadcrumbService = inject(PdfViewerPageBreadcrumbsService),
  dataService = inject(BitstreamDataService),
): Observable<BreadcrumbConfig<Bitstream>> => {
  const linksToFollow: FollowLinkConfig<DSpaceObject>[] = BITSTREAM_PAGE_LINKS_TO_FOLLOW as FollowLinkConfig<DSpaceObject>[];
  return DSOBreadcrumbResolver(route, state, breadcrumbService, dataService, ...linksToFollow) as Observable<BreadcrumbConfig<Bitstream>>;
};
