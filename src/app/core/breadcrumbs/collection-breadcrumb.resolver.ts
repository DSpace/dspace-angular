import { Injectable } from '@angular/core';
import { DSOBreadcrumbsService } from './dso-breadcrumbs.service';
import { DSOBreadcrumbResolver } from './dso-breadcrumb.resolver';
import { Collection } from '../shared/collection.model';
import { CollectionDataService } from '../data/collection-data.service';
import { followLink, FollowLinkConfig } from '../../shared/utils/follow-link-config.model';

/**
 * The class that resolves the BreadcrumbConfig object for a Collection
 */
@Injectable({
  providedIn: 'root'
})
export class CollectionBreadcrumbResolver extends DSOBreadcrumbResolver<Collection> {
  constructor(protected breadcrumbService: DSOBreadcrumbsService, protected dataService: CollectionDataService) {
    super(breadcrumbService, dataService);
  }

  /**
   * Method that returns the follow links to already resolve
   * The self links defined in this list are expected to be requested somewhere in the near future
   * Requesting them as embeds will limit the number of requests
   */
  get followLinks(): Array<FollowLinkConfig<Collection>> {
    return [
      followLink('parentCommunity', undefined, true,
        followLink('parentCommunity')
      )
    ];
  }
}
