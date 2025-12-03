import { AdminNotifyMessage } from '@dspace/core/coar-notify/notify-info/models/admin-notify-message.model';
import { AdminNotifySearchResult } from '@dspace/core/coar-notify/notify-info/models/admin-notify-message-search-result.model';
import { Collection } from '@dspace/core/shared/collection.model';
import { Community } from '@dspace/core/shared/community.model';
import { GenericConstructor } from '@dspace/core/shared/generic-constructor';
import { Item } from '@dspace/core/shared/item.model';
import { ClaimedTaskSearchResult } from '@dspace/core/shared/object-collection/claimed-task-search-result.model';
import { CollectionSearchResult } from '@dspace/core/shared/object-collection/collection-search-result.model';
import { CommunitySearchResult } from '@dspace/core/shared/object-collection/community-search-result.model';
import { ItemSearchResult } from '@dspace/core/shared/object-collection/item-search-result.model';
import { ListableObject } from '@dspace/core/shared/object-collection/listable-object.model';
import { PoolTaskSearchResult } from '@dspace/core/shared/object-collection/pool-task-search-result.model';
import { WorkflowItemSearchResult } from '@dspace/core/shared/object-collection/workflow-item-search-result.model';
import { WorkspaceItemSearchResult } from '@dspace/core/shared/object-collection/workspace-item-search-result.model';
import { WorkflowItem } from '@dspace/core/submission/models/workflowitem.model';
import { WorkspaceItem } from '@dspace/core/submission/models/workspaceitem.model';
import { ClaimedTask } from '@dspace/core/tasks/models/claimed-task-object.model';
import { PoolTask } from '@dspace/core/tasks/models/pool-task-object.model';

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
