import { ResourceType } from '../../core/shared/resource-type';
import { WorkspaceitemDataService } from '../../core/submission/workspaceitem-data.service';
import { ClaimedTaskDataService } from '../../core/tasks/claimed-task-data.service';
import { PoolTaskDataService } from '../../core/tasks/pool-task-data.service';
import { WorkflowitemDataService } from '../../core/submission/workflowitem-data.service';
import { ItemDataService } from '../../core/data/item-data.service';
/**
 * Class to return DataService for given ResourceType
 */
var MydspaceActionsServiceFactory = /** @class */ (function () {
    function MydspaceActionsServiceFactory() {
    }
    MydspaceActionsServiceFactory.prototype.getConstructor = function (type) {
        switch (type) {
            case ResourceType.Item: {
                return ItemDataService;
            }
            case ResourceType.Workspaceitem: {
                return WorkspaceitemDataService;
            }
            case ResourceType.Workflowitem: {
                return WorkflowitemDataService;
            }
            case ResourceType.ClaimedTask: {
                return ClaimedTaskDataService;
            }
            case ResourceType.PoolTask: {
                return PoolTaskDataService;
            }
            default: {
                return undefined;
            }
        }
    };
    return MydspaceActionsServiceFactory;
}());
export { MydspaceActionsServiceFactory };
//# sourceMappingURL=mydspace-actions-service.factory.js.map