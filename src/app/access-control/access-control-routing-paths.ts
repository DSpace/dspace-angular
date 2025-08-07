import { Group } from '@dspace/core/eperson/models/group.model';
import { URLCombiner } from '@dspace/core/url-combiner/url-combiner';

export const EPERSON_PATH = 'epeople';

export const ACCESS_CONTROL_MODULE_PATH = 'access-control';

export function getAccessControlModuleRoute() {
  return `/${ACCESS_CONTROL_MODULE_PATH}`;
}

export function getEPersonsRoute(): string {
  return new URLCombiner(getAccessControlModuleRoute(), EPERSON_PATH).toString();
}

export function getEPersonEditRoute(id: string): string {
  return new URLCombiner(getEPersonsRoute(), id, 'edit').toString();
}

export const GROUP_PATH = 'groups';

export function getGroupsRoute() {
  return new URLCombiner(getAccessControlModuleRoute(), GROUP_PATH).toString();
}

export function getGroupEditRoute(id: string) {
  return new URLCombiner(getGroupsRoute(), id, 'edit').toString();
}

/**
 * Get Edit page of group
 * @param group Group we want edit page for
 */
export function getGroupEditPageRouterLink(group: Group): string {
  return getGroupEditRoute(group.id);
}
