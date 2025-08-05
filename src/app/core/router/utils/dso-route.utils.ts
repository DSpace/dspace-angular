import {
  hasValue,
  isNotEmpty,
} from '@dspace/shared/utils/empty.util';

import { Collection } from '../../shared/collection.model';
import { Community } from '../../shared/community.model';
import { DSpaceObject } from '../../shared/dspace-object.model';
import { Item } from '../../shared/item.model';
import { URLCombiner } from '../../url-combiner/url-combiner';
import {
  ENTITY_MODULE_PATH,
  getCollectionModuleRoute,
  getCommunityModuleRoute,
  getItemModuleRoute,
} from '../core-routing-paths';

export function getCollectionPageRoute(collectionId: string) {
  return new URLCombiner(getCollectionModuleRoute(), collectionId).toString();
}

export function getCommunityPageRoute(communityId: string) {
  return new URLCombiner(getCommunityModuleRoute(), communityId).toString();
}

/**
 * Get the route to an item's page
 * Depending on the item's entity type, the route will either start with /items or /entities
 * @param item  The item to retrieve the route for
 */
export function getItemPageRoute(item: Item) {
  const type = item.firstMetadataValue('dspace.entity.type');
  return getEntityPageRoute(type, item.uuid);
}

export function getEntityPageRoute(entityType: string, itemId: string) {
  if (isNotEmpty(entityType)) {
    return new URLCombiner(`/${ENTITY_MODULE_PATH}`, encodeURIComponent(entityType.toLowerCase()), itemId).toString();
  } else {
    return new URLCombiner(getItemModuleRoute(), itemId).toString();
  }
}

export function getDSORoute(dso: DSpaceObject): string {
  if (hasValue(dso)) {
    switch ((dso as any).type) {
      case Community.type.value:
        return getCommunityPageRoute(dso.uuid);
      case Collection.type.value:
        return getCollectionPageRoute(dso.uuid);
      case Item.type.value:
        return getItemPageRoute(dso as Item);
    }
  }
}
