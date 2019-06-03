import * as tslib_1 from "tslib";
import { autoserialize, autoserializeAs, inheritSerialization } from 'cerialize';
import { NormalizedDSpaceObject } from '../../cache/models/normalized-dspace-object.model';
import { WorkspaceitemSectionsObject } from './workspaceitem-sections.model';
/**
 * An abstract model class for a NormalizedSubmissionObject.
 */
var NormalizedSubmissionObject = /** @class */ (function (_super) {
    tslib_1.__extends(NormalizedSubmissionObject, _super);
    function NormalizedSubmissionObject() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], NormalizedSubmissionObject.prototype, "id", void 0);
    tslib_1.__decorate([
        autoserializeAs(String, 'id'),
        tslib_1.__metadata("design:type", String)
    ], NormalizedSubmissionObject.prototype, "uuid", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", Date)
    ], NormalizedSubmissionObject.prototype, "lastModified", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", WorkspaceitemSectionsObject)
    ], NormalizedSubmissionObject.prototype, "sections", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", Array)
    ], NormalizedSubmissionObject.prototype, "errors", void 0);
    NormalizedSubmissionObject = tslib_1.__decorate([
        inheritSerialization(NormalizedDSpaceObject)
    ], NormalizedSubmissionObject);
    return NormalizedSubmissionObject;
}(NormalizedDSpaceObject));
export { NormalizedSubmissionObject };
//# sourceMappingURL=normalized-submission-object.model.js.map