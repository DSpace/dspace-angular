import { URLCombiner } from '@dspace/core/url-combiner/url-combiner';

import { getWorkspaceItemModuleRoute } from '../app-routing-paths';

export function getWorkspaceItemViewRoute(wfiId: string) {
  return new URLCombiner(getWorkspaceItemModuleRoute(), wfiId, WORKSPACE_ITEM_VIEW_PATH).toString();
}

export const WORKSPACE_ITEM_VIEW_PATH = 'view';
