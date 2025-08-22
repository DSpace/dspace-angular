import { Item } from '../core/shared/item.model';
import { URLCombiner } from '../core/url-combiner/url-combiner';
import { isNotEmpty } from '../shared/empty.util';

export const ITEM_MODULE_PATH = 'items';


export const ENTITY_MODULE_PATH = 'entities';

/**
 * Normalize a namespace by ensuring it starts with '/' and doesn't end with '/'
 */
function normalizeNamespace(namespace?: string): string {
  if (!namespace || namespace === '/') {
    return '';
  }

  let normalized = namespace;
  if (!normalized.startsWith('/')) {
    normalized = '/' + normalized;
  }
  if (normalized.endsWith('/')) {
    normalized = normalized.slice(0, -1);
  }
  return normalized;
}

export function getItemModuleRoute(namespace?: string) {
  const normalizedNamespace = normalizeNamespace(namespace);
  return `${normalizedNamespace}/${ITEM_MODULE_PATH}`;
}

/**
 * Get the route to an item's page
 * Depending on the item's entity type, the route will either start with /items or /entities
 * @param item      The item to retrieve the route for
 * @param namespace Optional namespace to prepend to the route
 */
export function getItemPageRoute(item: Item, namespace?: string) {
  const type = item.firstMetadataValue('dspace.entity.type');
  return getEntityPageRoute(type, item.uuid, namespace);
}

export function getItemEditRoute(item: Item, namespace?: string) {
  return new URLCombiner(getItemPageRoute(item, namespace), ITEM_EDIT_PATH).toString();
}

export function getItemEditVersionhistoryRoute(item: Item, namespace?: string) {
  return new URLCombiner(getItemPageRoute(item, namespace), ITEM_EDIT_PATH, ITEM_EDIT_VERSIONHISTORY_PATH).toString();
}

export function getEntityPageRoute(entityType: string, itemId: string, namespace?: string) {
  const normalizedNamespace = normalizeNamespace(namespace);
  if (isNotEmpty(entityType)) {
    return new URLCombiner(`${normalizedNamespace}/entities`, encodeURIComponent(entityType.toLowerCase()), itemId).toString();
  } else {
    return new URLCombiner(getItemModuleRoute(namespace), itemId).toString();
  }
}

export function getEntityEditRoute(entityType: string, itemId: string, namespace?: string) {
  return new URLCombiner(getEntityPageRoute(entityType, itemId, namespace), ITEM_EDIT_PATH).toString();
}

/**
 * Get the route to an item's version
 * @param versionId the ID of the version for which the route will be retrieved
 * @param namespace Optional namespace to prepend to the route
 */
export function getItemVersionRoute(versionId: string, namespace?: string) {
  return new URLCombiner(getItemModuleRoute(namespace), ITEM_VERSION_PATH, versionId).toString();
}

export const ITEM_EDIT_PATH = 'edit';
export const ITEM_EDIT_VERSIONHISTORY_PATH = 'versionhistory';
export const ITEM_VERSION_PATH = 'version';
export const UPLOAD_BITSTREAM_PATH = 'bitstreams/new';
export const ORCID_PATH = 'orcid';

export const ITEM_ACCESS_BY_TOKEN_PATH = 'access-by-token';
