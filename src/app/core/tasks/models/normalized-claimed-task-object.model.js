import * as tslib_1 from "tslib";
import { NormalizedTaskObject } from './normalized-task-object.model';
import { mapsTo, relationship } from '../../cache/builders/build-decorators';
import { autoserialize, inheritSerialization } from 'cerialize';
import { ClaimedTask } from './claimed-task-object.model';
import { ResourceType } from '../../shared/resource-type';
/**
 * A normalized model class for a ClaimedTask.
 */
var NormalizedClaimedTask = /** @class */ (function (_super) {
    tslib_1.__extends(NormalizedClaimedTask, _super);
    function NormalizedClaimedTask() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], NormalizedClaimedTask.prototype, "id", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], NormalizedClaimedTask.prototype, "step", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], NormalizedClaimedTask.prototype, "action", void 0);
    tslib_1.__decorate([
        autoserialize,
        relationship(ResourceType.Workflowitem, false),
        tslib_1.__metadata("design:type", String)
    ], NormalizedClaimedTask.prototype, "workflowitem", void 0);
    NormalizedClaimedTask = tslib_1.__decorate([
        mapsTo(ClaimedTask),
        inheritSerialization(NormalizedTaskObject)
    ], NormalizedClaimedTask);
    return NormalizedClaimedTask;
}(NormalizedTaskObject));
export { NormalizedClaimedTask };
//# sourceMappingURL=normalized-claimed-task-object.model.js.map