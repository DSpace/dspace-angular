import { AdminNotifyMessage } from '../../admin/admin-notify-message/models/admin-notify-message.model';
import { AdminNotifySearchResult } from '../../admin/admin-notify-message/models/admin-notify-message-search-result.model';
import { ClaimedTaskSearchResult } from '../../object-collection/claimed-task-search-result.model';
import { CollectionSearchResult } from '../../object-collection/collection-search-result.model';
import { CommunitySearchResult } from '../../object-collection/community-search-result.model';
import { ItemSearchResult } from '../../object-collection/item-search-result.model';
import { ListableObject } from '../../object-collection/listable-object.model';
import { PoolTaskSearchResult } from '../../object-collection/pool-task-search-result.model';
import { WorkflowItemSearchResult } from '../../object-collection/workflow-item-search-result.model';
import { WorkspaceItemSearchResult } from '../../object-collection/workspace-item-search-result.model';
import { Collection } from '../../shared/collection.model';
import { Community } from '../../shared/community.model';
import { GenericConstructor } from '../../shared/generic-constructor';
import { Item } from '../../shared/item.model';
import { WorkflowItem } from '../../submission/models/workflowitem.model';
import { WorkspaceItem } from '../../submission/models/workspaceitem.model';
import { ClaimedTask } from '../../tasks/models/claimed-task-object.model';
import { PoolTask } from '../../tasks/models/pool-task-object.model';


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
