import { Injectable } from '@angular/core';

import { ITEM_PAGE_LINKS_TO_FOLLOW } from '../../item-page/item.resolver';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { ItemDataService } from '../data/item-data.service';
import { Item } from '../shared/item.model';
import { DSOBreadcrumbResolver } from './dso-breadcrumb.resolver';
import { DSOBreadcrumbsService } from './dso-breadcrumbs.service';

/**
 * The class that resolves the BreadcrumbConfig object for an Item
 */
@Injectable({
  providedIn: 'root',
})
export class ItemBreadcrumbResolver extends DSOBreadcrumbResolver<Item> {
  constructor(protected breadcrumbService: DSOBreadcrumbsService, protected dataService: ItemDataService) {
    super(breadcrumbService, dataService);
  }

  /**
   * Method that returns the follow links to already resolve
   * The self links defined in this list are expected to be requested somewhere in the near future
   * Requesting them as embeds will limit the number of requests
   */
  get followLinks(): FollowLinkConfig<Item>[] {
    return ITEM_PAGE_LINKS_TO_FOLLOW;
  }
}
