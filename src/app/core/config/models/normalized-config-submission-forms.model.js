import * as tslib_1 from "tslib";
import { autoserialize, inheritSerialization } from 'cerialize';
import { NormalizedConfigObject } from './normalized-config.model';
/**
 * Normalized class for the configuration describing the submission form
 */
var NormalizedSubmissionFormsModel = /** @class */ (function (_super) {
    tslib_1.__extends(NormalizedSubmissionFormsModel, _super);
    function NormalizedSubmissionFormsModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", Array)
    ], NormalizedSubmissionFormsModel.prototype, "rows", void 0);
    NormalizedSubmissionFormsModel = tslib_1.__decorate([
        inheritSerialization(NormalizedConfigObject)
    ], NormalizedSubmissionFormsModel);
    return NormalizedSubmissionFormsModel;
}(NormalizedConfigObject));
export { NormalizedSubmissionFormsModel };
//# sourceMappingURL=normalized-config-submission-forms.model.js.map