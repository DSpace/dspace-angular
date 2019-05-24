import { DataService } from '../../core/data/data.service';
import { ResourceType } from '../../core/shared/resource-type';
import { WorkspaceitemDataService } from '../../core/submission/workspaceitem-data.service';
import { ClaimedTaskDataService } from '../../core/tasks/claimed-task-data.service';
import { PoolTaskDataService } from '../../core/tasks/pool-task-data.service';
import { WorkflowitemDataService } from '../../core/submission/workflowitem-data.service';
import { CacheableObject } from '../../core/cache/object-cache.reducer';
import { ItemDataService } from '../../core/data/item-data.service';

/**
 * Class to return DataService for given ResourceType
 */
export class MydspaceActionsServiceFactory<T extends CacheableObject, TService extends DataService<T>> {
  public getConstructor(type: ResourceType): TService {
    switch (type) {
      case ResourceType.Item: {
        return ItemDataService as any;
      }
      case ResourceType.Workspaceitem: {
        return WorkspaceitemDataService as any;
      }
      case ResourceType.Workflowitem: {
        return WorkflowitemDataService as any;
      }
      case ResourceType.ClaimedTask: {
        return ClaimedTaskDataService as any;
      }
      case ResourceType.PoolTask: {
        return PoolTaskDataService as any;
      }
      default: {
        return undefined;
      }
    }
  }
}
