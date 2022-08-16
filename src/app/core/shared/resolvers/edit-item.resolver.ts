import { ItemDataService } from './../../data/item-data.service';
import { Injectable } from '@angular/core';
import { Item } from '../item.model';
import { followLink, FollowLinkConfig } from '../../../shared/utils/follow-link-config.model';
import { EditDsoResolver } from './edit-dso.resolver';

/**
 * This class represents a resolver that requests a specific Item before the route is activated
 */
@Injectable()
export class EditItemResolver extends EditDsoResolver<Item> {
  constructor(
    protected itemdataService: ItemDataService,
  ) {
    super(itemdataService);
  }

  getFollowLinks(): FollowLinkConfig<Item>[] {
    return [
      followLink('owningCollection', {},
        followLink('parentCommunity', {},
          followLink('parentCommunity'))
      ),
      followLink('relationships'),
      followLink('version', {}, followLink('versionhistory')),
      followLink('thumbnail'),
      followLink('metrics')
    ];
  }
}
