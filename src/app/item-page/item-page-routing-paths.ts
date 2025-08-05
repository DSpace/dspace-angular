import { getItemModuleRoute } from '@dspace/core/router/core-routing-paths';
import {
  getEntityPageRoute,
  getItemPageRoute,
} from '@dspace/core/router/utils/dso-route.utils';
import { Item } from '@dspace/core/shared/item.model';
import { URLCombiner } from '@dspace/core/url-combiner/url-combiner';

export function getItemEditRoute(item: Item) {
  return new URLCombiner(getItemPageRoute(item), ITEM_EDIT_PATH).toString();
}

export function getItemEditVersionhistoryRoute(item: Item) {
  return new URLCombiner(getItemPageRoute(item), ITEM_EDIT_PATH, ITEM_EDIT_VERSIONHISTORY_PATH).toString();
}

export function getEntityEditRoute(entityType: string, itemId: string) {
  return new URLCombiner(getEntityPageRoute(entityType, itemId), ITEM_EDIT_PATH).toString();
}

/**
 * Get the route to an item's version
 * @param versionId the ID of the version for which the route will be retrieved
 */
export function getItemVersionRoute(versionId: string) {
  return new URLCombiner(getItemModuleRoute(), ITEM_VERSION_PATH, versionId).toString();
}

export const ITEM_EDIT_PATH = 'edit';
export const ITEM_EDIT_VERSIONHISTORY_PATH = 'versionhistory';
export const ITEM_VERSION_PATH = 'version';
export const UPLOAD_BITSTREAM_PATH = 'bitstreams/new';
export const ORCID_PATH = 'orcid';

export const ITEM_ACCESS_BY_TOKEN_PATH = 'access-by-token';
