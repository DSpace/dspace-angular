import { AdminNotifyMessage } from '../../admin/admin-notify-message/models/admin-notify-message.model';
import { AdminNotifySearchResult } from '../../admin/admin-notify-message/models/admin-notify-message-search-result.model';
import { ClaimedTaskSearchResult } from '@dspace/core';
import { CollectionSearchResult } from '@dspace/core';
import { CommunitySearchResult } from '@dspace/core';
import { ItemSearchResult } from '@dspace/core';
import { ListableObject } from '@dspace/core';
import { PoolTaskSearchResult } from '@dspace/core';
import { WorkflowItemSearchResult } from '@dspace/core';
import { WorkspaceItemSearchResult } from '@dspace/core';
import { Collection } from '@dspace/core';
import { Community } from '@dspace/core';
import { GenericConstructor } from '@dspace/core';
import { Item } from '@dspace/core';
import { WorkflowItem } from '@dspace/core';
import { WorkspaceItem } from '@dspace/core';
import { ClaimedTask } from '@dspace/core';
import { PoolTask } from '@dspace/core';

/**
 * Contains the mapping between a search result component and a DSpaceObject
 */
export const SEARCH_RESULT_MAP = new Map<string| GenericConstructor<ListableObject>, GenericConstructor<ListableObject>>([
  [AdminNotifyMessage, AdminNotifySearchResult],
  [ClaimedTask, ClaimedTaskSearchResult],
  [PoolTask, PoolTaskSearchResult],
  [Collection, CollectionSearchResult],
  [Community, CommunitySearchResult],
  [Item, ItemSearchResult],
  [WorkflowItem, WorkflowItemSearchResult],
  [WorkspaceItem, WorkspaceItemSearchResult],
]);


/**
 * Requests the matching component based on a given DSpaceObject's constructor
 * @param {GenericConstructor<ListableObject>} domainConstructor The DSpaceObject's constructor for which the search result component is requested
 * @returns The component's constructor that matches the given DSpaceObject
 */
export function getSearchResultFor(domainConstructor: GenericConstructor<ListableObject>) {
  return SEARCH_RESULT_MAP.get(domainConstructor);
}
