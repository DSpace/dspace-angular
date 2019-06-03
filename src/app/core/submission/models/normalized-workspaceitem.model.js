import * as tslib_1 from "tslib";
import { autoserialize, inheritSerialization } from 'cerialize';
import { Workspaceitem } from './workspaceitem.model';
import { NormalizedSubmissionObject } from './normalized-submission-object.model';
import { mapsTo, relationship } from '../../cache/builders/build-decorators';
import { NormalizedDSpaceObject } from '../../cache/models/normalized-dspace-object.model';
import { ResourceType } from '../../shared/resource-type';
/**
 * An model class for a NormalizedWorkspaceItem.
 */
var NormalizedWorkspaceItem = /** @class */ (function (_super) {
    tslib_1.__extends(NormalizedWorkspaceItem, _super);
    function NormalizedWorkspaceItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    tslib_1.__decorate([
        autoserialize,
        relationship(ResourceType.Collection, false),
        tslib_1.__metadata("design:type", String)
    ], NormalizedWorkspaceItem.prototype, "collection", void 0);
    tslib_1.__decorate([
        autoserialize,
        relationship(ResourceType.Item, false),
        tslib_1.__metadata("design:type", String)
    ], NormalizedWorkspaceItem.prototype, "item", void 0);
    tslib_1.__decorate([
        autoserialize,
        relationship(ResourceType.SubmissionDefinition, false),
        tslib_1.__metadata("design:type", String)
    ], NormalizedWorkspaceItem.prototype, "submissionDefinition", void 0);
    tslib_1.__decorate([
        autoserialize,
        relationship(ResourceType.EPerson, false),
        tslib_1.__metadata("design:type", String)
    ], NormalizedWorkspaceItem.prototype, "submitter", void 0);
    NormalizedWorkspaceItem = tslib_1.__decorate([
        mapsTo(Workspaceitem),
        inheritSerialization(NormalizedDSpaceObject),
        inheritSerialization(NormalizedSubmissionObject)
    ], NormalizedWorkspaceItem);
    return NormalizedWorkspaceItem;
}(NormalizedSubmissionObject));
export { NormalizedWorkspaceItem };
//# sourceMappingURL=normalized-workspaceitem.model.js.map