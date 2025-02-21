import { CacheableObject } from '../../../../modules/core/src/lib/core/cache/cacheable-object.model';
import { IdentifiableDataService } from '../../../../modules/core/src/lib/core/data/base/identifiable-data.service';
import { ItemDataService } from '../../../../modules/core/src/lib/core/data/item-data.service';
import { Item } from '../../../../modules/core/src/lib/core/shared/item.model';
import { ResourceType } from '../../../../modules/core/src/lib/core/shared/resource-type';
import { WorkflowItem } from '../../../../modules/core/src/lib/core/submission/models/workflowitem.model';
import { WorkspaceItem } from '../../../../modules/core/src/lib/core/submission/models/workspaceitem.model';
import { WorkflowItemDataService } from '../../../../modules/core/src/lib/core/submission/workflowitem-data.service';
import { WorkspaceitemDataService } from '../../../../modules/core/src/lib/core/submission/workspaceitem-data.service';
import { ClaimedTaskDataService } from '../../../../modules/core/src/lib/core/tasks/claimed-task-data.service';
import { ClaimedTask } from '../../../../modules/core/src/lib/core/tasks/models/claimed-task-object.model';
import { PoolTask } from '../../../../modules/core/src/lib/core/tasks/models/pool-task-object.model';
import { PoolTaskDataService } from '../../../../modules/core/src/lib/core/tasks/pool-task-data.service';

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
