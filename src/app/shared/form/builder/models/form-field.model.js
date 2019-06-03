import * as tslib_1 from "tslib";
import { autoserialize } from 'cerialize';
var FormFieldModel = /** @class */ (function () {
    function FormFieldModel() {
    }
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], FormFieldModel.prototype, "hints", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], FormFieldModel.prototype, "label", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", Array)
    ], FormFieldModel.prototype, "languageCodes", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], FormFieldModel.prototype, "mandatoryMessage", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], FormFieldModel.prototype, "mandatory", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", Boolean)
    ], FormFieldModel.prototype, "repeatable", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", Object)
    ], FormFieldModel.prototype, "input", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", Array)
    ], FormFieldModel.prototype, "selectableMetadata", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", Array)
    ], FormFieldModel.prototype, "rows", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], FormFieldModel.prototype, "scope", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], FormFieldModel.prototype, "style", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", Object)
    ], FormFieldModel.prototype, "value", void 0);
    return FormFieldModel;
}());
export { FormFieldModel };
//# sourceMappingURL=form-field.model.js.map