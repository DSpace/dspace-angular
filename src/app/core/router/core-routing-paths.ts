export const FORBIDDEN_PATH = '403';

export function getForbiddenRoute() {
  return `/${FORBIDDEN_PATH}`;
}

export const PAGE_NOT_FOUND_PATH = '404';

export function getPageNotFoundRoute() {
  return `/${PAGE_NOT_FOUND_PATH}`;
}

export const INTERNAL_SERVER_ERROR = '500';

export const ERROR_PAGE = 'error';

export function getPageInternalServerErrorRoute() {
  return `/${INTERNAL_SERVER_ERROR}`;
}

export const COLLECTION_MODULE_PATH = 'collections';

export function getCollectionModuleRoute() {
  return `/${COLLECTION_MODULE_PATH}`;
}

export const COMMUNITY_MODULE_PATH = 'communities';

export function getCommunityModuleRoute() {
  return `/${COMMUNITY_MODULE_PATH}`;
}


export const ITEM_MODULE_PATH = 'items';

export function getItemModuleRoute() {
  return `/${ITEM_MODULE_PATH}`;
}

export const ENTITY_MODULE_PATH = 'entities';

export const BITSTREAM_MODULE_PATH = 'bitstreams';
/**
 * The bitstream module path to resolve XMLUI and JSPUI bitstream download URLs
 */
export const LEGACY_BITSTREAM_MODULE_PATH = 'bitstream';

export function getBitstreamModuleRoute() {
  return `/${BITSTREAM_MODULE_PATH}`;
}

export const HOME_PAGE_PATH = 'home';

export function getHomePageRoute() {
  return `/${HOME_PAGE_PATH}`;
}
