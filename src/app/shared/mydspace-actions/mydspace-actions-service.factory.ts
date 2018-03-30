import { DataService } from '../../core/data/data.service';
import { GenericConstructor } from '../../core/shared/generic-constructor';
import { ResourceType } from '../../core/shared/resource-type';
import { WorkspaceitemDataService } from '../../core/submission/workspaceitem-data.service';
import { ClaimedTaskDataService } from '../../core/tasks/claimed-task-data.service';
import { PoolTaskDataService } from '../../core/tasks/pool-task-data.service';
import { WorkflowitemDataService } from '../../core/submission/workflowitem-data.service';
import { NormalizedObject } from '../../core/cache/models/normalized-object.model';

export class MydspaceActionsServiceFactory<T, TNormalized extends NormalizedObject, TService extends DataService<TNormalized, T>> {
  public getConstructor(type: ResourceType): TService {
    switch (type) {
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
