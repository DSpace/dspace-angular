import { CollectionDataService } from '../../data/collection-data.service';
import { Injectable } from '@angular/core';
import { Collection } from '../collection.model';
import { followLink, FollowLinkConfig } from '../../../shared/utils/follow-link-config.model';
import { EditDsoResolver } from './edit-dso.resolver';

/**
 * This class represents a resolver that requests a specific Collection before the route is activated
 */
@Injectable()
export class EditCollectionResolver extends EditDsoResolver<Collection> {
  constructor(
    protected collectionDataService: CollectionDataService,
  ) {
    super(collectionDataService);
  }

  getFollowLinks(): FollowLinkConfig<Collection>[] {
    return [
      followLink('parentCommunity', {},
        followLink('parentCommunity')
      ),
      followLink('logo')
    ];
  }
}
