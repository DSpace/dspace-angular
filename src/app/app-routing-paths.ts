import { getCollectionPageRoute } from './collection-page/collection-page-routing-paths';
import { getCommunityPageRoute } from './community-page/community-page-routing-paths';
import { Collection } from './core/shared/collection.model';
import { Community } from './core/shared/community.model';
import { DSpaceObject } from './core/shared/dspace-object.model';
import { Item } from './core/shared/item.model';
import { URLCombiner } from './core/url-combiner/url-combiner';
import {
  getItemModuleRoute,
  getItemPageRoute,
} from './item-page/item-page-routing-paths';
import { hasValue } from './shared/empty.util';

export const BITSTREAM_MODULE_PATH = 'bitstreams';

/**
 * The bitstream module path to resolve XMLUI and JSPUI bitstream download URLs
 */
export const LEGACY_BITSTREAM_MODULE_PATH = 'bitstream';

export function getBitstreamModuleRoute() {
  return `/${BITSTREAM_MODULE_PATH}`;
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
export function getBitstreamDownloadWithAccessTokenRoute(bitstream, accessToken): { routerLink: string, queryParams: any } {
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

export const COAR_NOTIFY_SUPPORT = 'coar-notify-support';

export const HOME_PAGE_PATH = 'home';

export function getHomePageRoute() {
  return `/${HOME_PAGE_PATH}`;
}

export const ADMIN_MODULE_PATH = 'admin';

export function getAdminModuleRoute() {
  return `/${ADMIN_MODULE_PATH}`;
}

export const PROFILE_MODULE_PATH = 'profile';

export function getProfileModuleRoute() {
  return `/${PROFILE_MODULE_PATH}`;
}

export const REGISTER_PATH = 'register';

export function getRegisterRoute() {
  return `/${REGISTER_PATH}`;

}

export const FORGOT_PASSWORD_PATH = 'forgot';

export function getForgotPasswordRoute() {
  return `/${FORGOT_PASSWORD_PATH}`;

}

export const WORKFLOW_ITEM_MODULE_PATH = 'workflowitems';

export function getWorkflowItemModuleRoute() {
  return `/${WORKFLOW_ITEM_MODULE_PATH}`;
}

export const WORKSPACE_ITEM_MODULE_PATH = 'workspaceitems';

export function getWorkspaceItemModuleRoute() {
  return `/${WORKSPACE_ITEM_MODULE_PATH}`;
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

export const FORBIDDEN_PATH = '403';

export function getForbiddenRoute() {
  return `/${FORBIDDEN_PATH}`;
}

export const PAGE_NOT_FOUND_PATH = '404';

export function getPageNotFoundRoute() {
  return `/${PAGE_NOT_FOUND_PATH}`;
}

export const INTERNAL_SERVER_ERROR = '500';

export function getPageInternalServerErrorRoute() {
  return `/${INTERNAL_SERVER_ERROR}`;
}

export const ERROR_PAGE = 'error';

export const INFO_MODULE_PATH = 'info';
export function getInfoModulePath() {
  return `/${INFO_MODULE_PATH}`;
}

export const ACCESS_CONTROL_MODULE_PATH = 'access-control';

export function getAccessControlModuleRoute() {
  return `/${ACCESS_CONTROL_MODULE_PATH}`;
}

export const REQUEST_COPY_MODULE_PATH = 'request-a-copy';
export function getRequestCopyModulePath() {
  return `/${REQUEST_COPY_MODULE_PATH}`;
}

export const HEALTH_PAGE_PATH = 'health';

export const SUBSCRIPTIONS_MODULE_PATH = 'subscriptions';

export function getSubscriptionsModuleRoute() {
  return `/${SUBSCRIPTIONS_MODULE_PATH}`;
}

export const EDIT_ITEM_PATH = 'edit-items';
export function getEditItemPageRoute() {
  return `/${EDIT_ITEM_PATH}`;
}
export const CORRECTION_TYPE_PATH = 'corrections';

