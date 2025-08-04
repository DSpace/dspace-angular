import { CacheableObject } from '@dspace/core/cache/cacheable-object.model';
import { IdentifiableDataService } from '@dspace/core/data/base/identifiable-data.service';
import { ItemDataService } from '@dspace/core/data/item-data.service';
import { Item } from '@dspace/core/shared/item.model';
import { ResourceType } from '@dspace/core/shared/resource-type';
import { WorkflowItem } from '@dspace/core/submission/models/workflowitem.model';
import { WorkspaceItem } from '@dspace/core/submission/models/workspaceitem.model';
import { WorkflowItemDataService } from '@dspace/core/submission/workflowitem-data.service';
import { WorkspaceitemDataService } from '@dspace/core/submission/workspaceitem-data.service';
import { ClaimedTaskDataService } from '@dspace/core/tasks/claimed-task-data.service';
import { ClaimedTask } from '@dspace/core/tasks/models/claimed-task-object.model';
import { PoolTask } from '@dspace/core/tasks/models/pool-task-object.model';
import { PoolTaskDataService } from '@dspace/core/tasks/pool-task-data.service';

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
