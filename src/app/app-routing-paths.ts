import { DSpaceObject } from './core/shared/dspace-object.model';
import { Community } from './core/shared/community.model';
import { Collection } from './core/shared/collection.model';
import { Item } from './core/shared/item.model';
import { getCommunityPageRoute } from './+community-page/community-page-routing-paths';
import { getCollectionPageRoute } from './+collection-page/collection-page-routing-paths';
import { getItemPageRoute } from './+item-page/item-page-routing-paths';

export const BITSTREAM_MODULE_PATH = 'bitstreams';

export function getBitstreamModuleRoute() {
  return `/${BITSTREAM_MODULE_PATH}`;
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

export function getDSORoute(dso: DSpaceObject): string {
  switch ((dso as any).type) {
    case Community.type.value:
      return getCommunityPageRoute(dso.uuid);
    case Collection.type.value:
      return getCollectionPageRoute(dso.uuid);
    case Item.type.value:
      return getItemPageRoute(dso.uuid);
  }
}

export const UNAUTHORIZED_PATH = 'unauthorized';

export function getUnauthorizedRoute() {
  return `/${UNAUTHORIZED_PATH}`;
}

export const INFO_MODULE_PATH = 'info';
export function getInfoModulePath() {
  return `/${INFO_MODULE_PATH}`;
}
