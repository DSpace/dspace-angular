import * as tslib_1 from "tslib";
import { autoserialize, autoserializeAs, inheritSerialization } from 'cerialize';
import { SubmissionSectionModel } from './config-submission-section.model';
import { PaginatedList } from '../../data/paginated-list';
import { NormalizedConfigObject } from './normalized-config.model';
/**
 * Normalized class for the configuration describing the submission
 */
var NormalizedSubmissionDefinitionsModel = /** @class */ (function (_super) {
    tslib_1.__extends(NormalizedSubmissionDefinitionsModel, _super);
    function NormalizedSubmissionDefinitionsModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", Boolean)
    ], NormalizedSubmissionDefinitionsModel.prototype, "isDefault", void 0);
    tslib_1.__decorate([
        autoserializeAs(SubmissionSectionModel),
        tslib_1.__metadata("design:type", PaginatedList)
    ], NormalizedSubmissionDefinitionsModel.prototype, "sections", void 0);
    NormalizedSubmissionDefinitionsModel = tslib_1.__decorate([
        inheritSerialization(NormalizedConfigObject)
    ], NormalizedSubmissionDefinitionsModel);
    return NormalizedSubmissionDefinitionsModel;
}(NormalizedConfigObject));
export { NormalizedSubmissionDefinitionsModel };
//# sourceMappingURL=normalized-config-submission-definitions.model.js.map