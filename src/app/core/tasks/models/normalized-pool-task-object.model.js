import * as tslib_1 from "tslib";
import { NormalizedTaskObject } from './normalized-task-object.model';
import { PoolTask } from './pool-task-object.model';
import { autoserialize, inheritSerialization } from 'cerialize';
import { mapsTo, relationship } from '../../cache/builders/build-decorators';
import { ResourceType } from '../../shared/resource-type';
/**
 * A normalized model class for a PoolTask.
 */
var NormalizedPoolTask = /** @class */ (function (_super) {
    tslib_1.__extends(NormalizedPoolTask, _super);
    function NormalizedPoolTask() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], NormalizedPoolTask.prototype, "id", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], NormalizedPoolTask.prototype, "step", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], NormalizedPoolTask.prototype, "action", void 0);
    tslib_1.__decorate([
        autoserialize,
        relationship(ResourceType.Workflowitem, false),
        tslib_1.__metadata("design:type", String)
    ], NormalizedPoolTask.prototype, "workflowitem", void 0);
    NormalizedPoolTask = tslib_1.__decorate([
        mapsTo(PoolTask),
        inheritSerialization(NormalizedTaskObject)
    ], NormalizedPoolTask);
    return NormalizedPoolTask;
}(NormalizedTaskObject));
export { NormalizedPoolTask };
//# sourceMappingURL=normalized-pool-task-object.model.js.map