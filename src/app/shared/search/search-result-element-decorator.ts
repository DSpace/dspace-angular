import { AdminNotifyMessage } from '../../admin/admin-notify-dashboard/models/admin-notify-message.model';
import { AdminNotifySearchResult } from '../../admin/admin-notify-dashboard/models/admin-notify-message-search-result.model';
import { Collection } from '../../core/shared/collection.model';
import { Community } from '../../core/shared/community.model';
import { GenericConstructor } from '../../core/shared/generic-constructor';
import { Item } from '../../core/shared/item.model';
import { WorkflowItem } from '../../core/submission/models/workflowitem.model';
import { WorkspaceItem } from '../../core/submission/models/workspaceitem.model';
import { ClaimedTask } from '../../core/tasks/models/claimed-task-object.model';
import { PoolTask } from '../../core/tasks/models/pool-task-object.model';
import { ClaimedTaskSearchResult } from '../object-collection/shared/claimed-task-search-result.model';
import { CollectionSearchResult } from '../object-collection/shared/collection-search-result.model';
import { CommunitySearchResult } from '../object-collection/shared/community-search-result.model';
import { ItemSearchResult } from '../object-collection/shared/item-search-result.model';
import { ListableObject } from '../object-collection/shared/listable-object.model';
import { PoolTaskSearchResult } from '../object-collection/shared/pool-task-search-result.model';
import { WorkflowItemSearchResult } from '../object-collection/shared/workflow-item-search-result.model';
import { WorkspaceItemSearchResult } from '../object-collection/shared/workspace-item-search-result.model';

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
