import { CacheableObject } from '@dspace/core';
import { IdentifiableDataService } from '@dspace/core';
import { ItemDataService } from '@dspace/core';
import { Item } from '@dspace/core';
import { ResourceType } from '@dspace/core';
import { WorkflowItem } from '@dspace/core';
import { WorkspaceItem } from '@dspace/core';
import { WorkflowItemDataService } from '@dspace/core';
import { WorkspaceitemDataService } from '@dspace/core';
import { ClaimedTaskDataService } from '@dspace/core';
import { ClaimedTask } from '@dspace/core';
import { PoolTask } from '@dspace/core';
import { PoolTaskDataService } from '@dspace/core';

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
