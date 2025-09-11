import {
  AdminNotifyMessage,
  AdminNotifySearchResult,
  Collection,
  Community,
  GenericConstructor,
  Item,
  ClaimedTaskSearchResult,
  CollectionSearchResult,
  CommunitySearchResult,
  ItemSearchResult,
  ListableObject,
  PoolTaskSearchResult,
  WorkflowItemSearchResult,
  WorkspaceItemSearchResult,
  WorkflowItem,
  WorkspaceItem,
  ClaimedTask,
  PoolTask,
} from '@dspace/core'

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
