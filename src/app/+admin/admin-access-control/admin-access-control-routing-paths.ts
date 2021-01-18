import { URLCombiner } from '../../core/url-combiner/url-combiner';
import { getAccessControlModuleRoute } from '../admin-routing-paths';

export const GROUP_EDIT_PATH = 'groups';

export function getGroupEditRoute(id: string) {
  return new URLCombiner(getAccessControlModuleRoute(), GROUP_EDIT_PATH, id).toString();
}
