import * as tslib_1 from "tslib";
import { autoserialize, inheritSerialization } from 'cerialize';
import { SectionsType } from '../../../submission/sections/sections-type';
import { NormalizedConfigObject } from './normalized-config.model';
/**
 * Normalized class for the configuration describing the submission section
 */
var NormalizedSubmissionSectionModel = /** @class */ (function (_super) {
    tslib_1.__extends(NormalizedSubmissionSectionModel, _super);
    function NormalizedSubmissionSectionModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], NormalizedSubmissionSectionModel.prototype, "header", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", Boolean)
    ], NormalizedSubmissionSectionModel.prototype, "mandatory", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], NormalizedSubmissionSectionModel.prototype, "sectionType", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", Object)
    ], NormalizedSubmissionSectionModel.prototype, "visibility", void 0);
    NormalizedSubmissionSectionModel = tslib_1.__decorate([
        inheritSerialization(NormalizedConfigObject)
    ], NormalizedSubmissionSectionModel);
    return NormalizedSubmissionSectionModel;
}(NormalizedConfigObject));
export { NormalizedSubmissionSectionModel };
//# sourceMappingURL=normalized-config-submission-section.model.js.map