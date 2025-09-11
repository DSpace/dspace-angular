import { getCommunityModuleRoute, getCollectionPageRoute, URLCombiner } from '@dspace/core'

export const COMMUNITY_PARENT_PARAMETER = 'parent';

export function getCommunityEditRoute(id: string) {
  return new URLCombiner(getCommunityModuleRoute(), id, COMMUNITY_EDIT_PATH).toString();
}

export function getCommunityCreateRoute() {
  return new URLCombiner(getCommunityModuleRoute(), COMMUNITY_CREATE_PATH).toString();
}

export function getCommunityEditRolesRoute(id) {
  return new URLCombiner(getCollectionPageRoute(id), COMMUNITY_EDIT_PATH, COMMUNITY_EDIT_ROLES_PATH).toString();
}

export const COMMUNITY_CREATE_PATH = 'create';
export const COMMUNITY_EDIT_PATH = 'edit';
export const COMMUNITY_EDIT_ROLES_PATH = 'roles';
