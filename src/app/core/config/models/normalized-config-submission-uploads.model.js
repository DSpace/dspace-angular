import * as tslib_1 from "tslib";
import { autoserialize, autoserializeAs, inheritSerialization } from 'cerialize';
import { SubmissionFormsModel } from './config-submission-forms.model';
import { NormalizedConfigObject } from './normalized-config.model';
/**
 * Normalized class for the configuration describing the submission upload section
 */
var NormalizedSubmissionUploadsModel = /** @class */ (function (_super) {
    tslib_1.__extends(NormalizedSubmissionUploadsModel, _super);
    function NormalizedSubmissionUploadsModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", Array)
    ], NormalizedSubmissionUploadsModel.prototype, "accessConditionOptions", void 0);
    tslib_1.__decorate([
        autoserializeAs(SubmissionFormsModel),
        tslib_1.__metadata("design:type", SubmissionFormsModel)
    ], NormalizedSubmissionUploadsModel.prototype, "metadata", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", Boolean)
    ], NormalizedSubmissionUploadsModel.prototype, "required", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", Number)
    ], NormalizedSubmissionUploadsModel.prototype, "maxSize", void 0);
    NormalizedSubmissionUploadsModel = tslib_1.__decorate([
        inheritSerialization(NormalizedConfigObject)
    ], NormalizedSubmissionUploadsModel);
    return NormalizedSubmissionUploadsModel;
}(NormalizedConfigObject));
export { NormalizedSubmissionUploadsModel };
//# sourceMappingURL=normalized-config-submission-uploads.model.js.map