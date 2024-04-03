import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';

import { BreadcrumbConfig } from '../../breadcrumbs/breadcrumb/breadcrumb-config.model';
import { ITEM_PAGE_LINKS_TO_FOLLOW } from '../../item-page/item.resolver';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { ItemDataService } from '../data/item-data.service';
import { DSpaceObject } from '../shared/dspace-object.model';
import { Item } from '../shared/item.model';
import { DSOBreadcrumbResolver } from './dso-breadcrumb.resolver';
import { DSOBreadcrumbsService } from './dso-breadcrumbs.service';

/**
 * The resolve function that resolves the BreadcrumbConfig object for an Item
 */
export const itemBreadcrumbResolver: ResolveFn<BreadcrumbConfig<Item>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  breadcrumbService: DSOBreadcrumbsService = inject(DSOBreadcrumbsService),
  dataService: ItemDataService = inject(ItemDataService),
): Observable<BreadcrumbConfig<Item>> => {
  const linksToFollow: FollowLinkConfig<DSpaceObject>[] = ITEM_PAGE_LINKS_TO_FOLLOW as FollowLinkConfig<DSpaceObject>[];
  return DSOBreadcrumbResolver(
    route,
    state,
    breadcrumbService,
    dataService,
    ...linksToFollow,
  ) as Observable<BreadcrumbConfig<Item>>;
};
