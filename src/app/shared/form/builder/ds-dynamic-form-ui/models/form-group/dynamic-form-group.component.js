import * as tslib_1 from "tslib";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicFormControlComponent, DynamicFormGroupModel, DynamicFormLayoutService, DynamicFormValidationService } from '@ng-dynamic-forms/core';
var DsDynamicFormGroupComponent = /** @class */ (function (_super) {
    tslib_1.__extends(DsDynamicFormGroupComponent, _super);
    /* tslint:enable:no-output-rename */
    function DsDynamicFormGroupComponent(layoutService, validationService) {
        var _this = _super.call(this, layoutService, validationService) || this;
        _this.layoutService = layoutService;
        _this.validationService = validationService;
        _this.bindId = true;
        /* tslint:disable:no-output-rename */
        _this.blur = new EventEmitter();
        _this.change = new EventEmitter();
        _this.focus = new EventEmitter();
        _this.customEvent = new EventEmitter();
        return _this;
    }
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], DsDynamicFormGroupComponent.prototype, "bindId", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", FormGroup)
    ], DsDynamicFormGroupComponent.prototype, "group", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], DsDynamicFormGroupComponent.prototype, "layout", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", DynamicFormGroupModel)
    ], DsDynamicFormGroupComponent.prototype, "model", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], DsDynamicFormGroupComponent.prototype, "templates", void 0);
    tslib_1.__decorate([
        Output('dfBlur'),
        tslib_1.__metadata("design:type", EventEmitter)
    ], DsDynamicFormGroupComponent.prototype, "blur", void 0);
    tslib_1.__decorate([
        Output('dfChange'),
        tslib_1.__metadata("design:type", EventEmitter)
    ], DsDynamicFormGroupComponent.prototype, "change", void 0);
    tslib_1.__decorate([
        Output('dfFocus'),
        tslib_1.__metadata("design:type", EventEmitter)
    ], DsDynamicFormGroupComponent.prototype, "focus", void 0);
    tslib_1.__decorate([
        Output('ngbEvent'),
        tslib_1.__metadata("design:type", EventEmitter)
    ], DsDynamicFormGroupComponent.prototype, "customEvent", void 0);
    DsDynamicFormGroupComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-dynamic-form-group',
            templateUrl: './dynamic-form-group.component.html',
            changeDetection: ChangeDetectionStrategy.Default
        }),
        tslib_1.__metadata("design:paramtypes", [DynamicFormLayoutService,
            DynamicFormValidationService])
    ], DsDynamicFormGroupComponent);
    return DsDynamicFormGroupComponent;
}(DynamicFormControlComponent));
export { DsDynamicFormGroupComponent };
//# sourceMappingURL=dynamic-form-group.component.js.map