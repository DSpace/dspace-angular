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
  getBitstreamModuleRoute,
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

export function getBitstreamDownloadRoute(bitstream): string {
  return new URLCombiner(getBitstreamModuleRoute(), bitstream.uuid, 'download').toString();
}

export function getBitstreamRequestACopyRoute(item, bitstream): { routerLink: string, queryParams: any } {
  const url = new URLCombiner(getItemModuleRoute(), item.uuid, 'request-a-copy').toString();
  return {
    routerLink: url,
    queryParams: {
      bitstream: bitstream.uuid,
    },
  };
}

/**
 * Get a bitstream download route with an access token (to provide direct access to a user) added as a query parameter
 * @param bitstream the bitstream to download
 * @param accessToken the access token, which should match an access_token in the requestitem table
 */
export function getBitstreamDownloadWithAccessTokenRoute(bitstream, accessToken): {
  routerLink: string,
  queryParams: any
} {
  const url = new URLCombiner(getBitstreamModuleRoute(), bitstream.uuid, 'download').toString();
  const options = {
    routerLink: url,
    queryParams: {},
  };
  // Only add the access token if it is not empty, otherwise keep valid empty query parameters
  if (hasValue(accessToken)) {
    options.queryParams = { accessToken: accessToken };
  }
  return options;
}
