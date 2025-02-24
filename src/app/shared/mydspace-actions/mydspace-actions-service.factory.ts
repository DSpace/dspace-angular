import {
  CacheableObject,
  ClaimedTask,
  ClaimedTaskDataService,
  IdentifiableDataService,
  Item,
  ItemDataService,
  PoolTask,
  PoolTaskDataService,
  ResourceType,
  WorkflowItem,
  WorkflowItemDataService,
  WorkspaceItem,
  WorkspaceitemDataService,
} from '@dspace/core';

/**
 * Class to return UpdateDataServiceImpl for given ResourceType
 */
export class MyDSpaceActionsServiceFactory<T extends CacheableObject, TService extends IdentifiableDataService<T>> {
  public getConstructor(type: ResourceType): TService {
    switch (type) {
      case Item.type: {
        return ItemDataService as any;
      }
      case WorkspaceItem.type: {
        return WorkspaceitemDataService as any;
      }
      case WorkflowItem.type: {
        return WorkflowItemDataService as any;
      }
      case ClaimedTask.type: {
        return ClaimedTaskDataService as any;
      }
      case PoolTask.type: {
        return PoolTaskDataService as any;
      }
      default: {
        return undefined;
      }
    }
  }
}
