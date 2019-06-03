import * as tslib_1 from "tslib";
import { autoserialize, inheritSerialization } from 'cerialize';
import { mapsTo, relationship } from '../../cache/builders/build-decorators';
import { ResourceType } from '../../shared/resource-type';
import { NormalizedDSpaceObject } from '../../cache/models/normalized-dspace-object.model';
import { TaskObject } from './task-object.model';
/**
 * An abstract normalized model class for a TaskObject.
 */
var NormalizedTaskObject = /** @class */ (function (_super) {
    tslib_1.__extends(NormalizedTaskObject, _super);
    function NormalizedTaskObject() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], NormalizedTaskObject.prototype, "id", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], NormalizedTaskObject.prototype, "step", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], NormalizedTaskObject.prototype, "action", void 0);
    tslib_1.__decorate([
        autoserialize,
        relationship(ResourceType.Workflowitem, false),
        tslib_1.__metadata("design:type", String)
    ], NormalizedTaskObject.prototype, "workflowitem", void 0);
    NormalizedTaskObject = tslib_1.__decorate([
        mapsTo(TaskObject),
        inheritSerialization(NormalizedDSpaceObject)
    ], NormalizedTaskObject);
    return NormalizedTaskObject;
}(NormalizedDSpaceObject));
export { NormalizedTaskObject };
//# sourceMappingURL=normalized-task-object.model.js.map