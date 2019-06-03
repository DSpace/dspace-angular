import * as tslib_1 from "tslib";
import { Component, EventEmitter, Input, Output, QueryList } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicFormArrayComponent, DynamicFormArrayModel, DynamicFormLayoutService, DynamicFormValidationService } from '@ng-dynamic-forms/core';
var DsDynamicFormArrayComponent = /** @class */ (function (_super) {
    tslib_1.__extends(DsDynamicFormArrayComponent, _super);
    /* tslint:enable:no-output-rename */
    function DsDynamicFormArrayComponent(layoutService, validationService) {
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
    ], DsDynamicFormArrayComponent.prototype, "bindId", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", FormGroup)
    ], DsDynamicFormArrayComponent.prototype, "group", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], DsDynamicFormArrayComponent.prototype, "layout", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", DynamicFormArrayModel)
    ], DsDynamicFormArrayComponent.prototype, "model", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", QueryList)
    ], DsDynamicFormArrayComponent.prototype, "templates", void 0);
    tslib_1.__decorate([
        Output('dfBlur'),
        tslib_1.__metadata("design:type", EventEmitter)
    ], DsDynamicFormArrayComponent.prototype, "blur", void 0);
    tslib_1.__decorate([
        Output('dfChange'),
        tslib_1.__metadata("design:type", EventEmitter)
    ], DsDynamicFormArrayComponent.prototype, "change", void 0);
    tslib_1.__decorate([
        Output('dfFocus'),
        tslib_1.__metadata("design:type", EventEmitter)
    ], DsDynamicFormArrayComponent.prototype, "focus", void 0);
    tslib_1.__decorate([
        Output('ngbEvent'),
        tslib_1.__metadata("design:type", EventEmitter)
    ], DsDynamicFormArrayComponent.prototype, "customEvent", void 0);
    DsDynamicFormArrayComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-dynamic-form-array',
            templateUrl: './dynamic-form-array.component.html'
        }),
        tslib_1.__metadata("design:paramtypes", [DynamicFormLayoutService,
            DynamicFormValidationService])
    ], DsDynamicFormArrayComponent);
    return DsDynamicFormArrayComponent;
}(DynamicFormArrayComponent));
export { DsDynamicFormArrayComponent };
//# sourceMappingURL=dynamic-form-array.component.js.map