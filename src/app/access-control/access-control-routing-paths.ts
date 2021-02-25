import { URLCombiner } from '../core/url-combiner/url-combiner';

export const GROUP_EDIT_PATH = 'groups';
export const ACCESS_CONTROL_MODULE_PATH = 'access-control';

export function getAccessControlModuleRoute() {
  return `/${ACCESS_CONTROL_MODULE_PATH}`;
}

export function getGroupEditRoute(id: string) {
  return new URLCombiner(getAccessControlModuleRoute(), GROUP_EDIT_PATH, id).toString();
}
