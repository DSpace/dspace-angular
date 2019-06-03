import * as tslib_1 from "tslib";
import { autoserialize, inheritSerialization } from 'cerialize';
import { mapsTo, relationship } from '../../cache/builders/build-decorators';
import { Workflowitem } from './workflowitem.model';
import { NormalizedSubmissionObject } from './normalized-submission-object.model';
import { ResourceType } from '../../shared/resource-type';
/**
 * An model class for a NormalizedWorkflowItem.
 */
var NormalizedWorkflowItem = /** @class */ (function (_super) {
    tslib_1.__extends(NormalizedWorkflowItem, _super);
    function NormalizedWorkflowItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    tslib_1.__decorate([
        autoserialize,
        relationship(ResourceType.Collection, false),
        tslib_1.__metadata("design:type", String)
    ], NormalizedWorkflowItem.prototype, "collection", void 0);
    tslib_1.__decorate([
        autoserialize,
        relationship(ResourceType.Item, false),
        tslib_1.__metadata("design:type", String)
    ], NormalizedWorkflowItem.prototype, "item", void 0);
    tslib_1.__decorate([
        autoserialize,
        relationship(ResourceType.SubmissionDefinition, false),
        tslib_1.__metadata("design:type", String)
    ], NormalizedWorkflowItem.prototype, "submissionDefinition", void 0);
    tslib_1.__decorate([
        autoserialize,
        relationship(ResourceType.EPerson, false),
        tslib_1.__metadata("design:type", String)
    ], NormalizedWorkflowItem.prototype, "submitter", void 0);
    NormalizedWorkflowItem = tslib_1.__decorate([
        mapsTo(Workflowitem),
        inheritSerialization(NormalizedSubmissionObject)
    ], NormalizedWorkflowItem);
    return NormalizedWorkflowItem;
}(NormalizedSubmissionObject));
export { NormalizedWorkflowItem };
//# sourceMappingURL=normalized-workflowitem.model.js.map