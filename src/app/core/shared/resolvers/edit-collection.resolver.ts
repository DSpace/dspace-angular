import { CollectionDataService } from '../../data/collection-data.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Collection } from '../collection.model';
import { followLink, FollowLinkConfig } from '../../../shared/utils/follow-link-config.model';
import { Store } from '@ngrx/store';
import { EditDsoResolver } from './edit-dso.resolver';

/**
 * This class represents a resolver that requests a specific Collection before the route is activated
 */
@Injectable()
export class EditCollectionResolver extends EditDsoResolver {
  constructor(
    protected collectionDataService: CollectionDataService,
    protected store: Store<Collection>,
    protected router: Router
  ) {
    super(collectionDataService, store, router);
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
