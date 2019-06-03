import * as tslib_1 from "tslib";
import { Component, ContentChildren, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicFormComponent, DynamicFormLayoutService, DynamicTemplateDirective, } from '@ng-dynamic-forms/core';
import { DsDynamicFormControlContainerComponent } from './ds-dynamic-form-control-container.component';
import { FormBuilderService } from '../form-builder.service';
var DsDynamicFormComponent = /** @class */ (function (_super) {
    tslib_1.__extends(DsDynamicFormComponent, _super);
    function DsDynamicFormComponent(formService, layoutService) {
        var _this = _super.call(this, formService, layoutService) || this;
        _this.formService = formService;
        _this.layoutService = layoutService;
        _this.formLayout = null;
        /* tslint:disable:no-output-rename */
        _this.blur = new EventEmitter();
        _this.change = new EventEmitter();
        _this.focus = new EventEmitter();
        _this.customEvent = new EventEmitter();
        return _this;
    }
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], DsDynamicFormComponent.prototype, "formId", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", FormGroup)
    ], DsDynamicFormComponent.prototype, "formGroup", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Array)
    ], DsDynamicFormComponent.prototype, "formModel", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], DsDynamicFormComponent.prototype, "formLayout", void 0);
    tslib_1.__decorate([
        Output('dfBlur'),
        tslib_1.__metadata("design:type", EventEmitter)
    ], DsDynamicFormComponent.prototype, "blur", void 0);
    tslib_1.__decorate([
        Output('dfChange'),
        tslib_1.__metadata("design:type", EventEmitter)
    ], DsDynamicFormComponent.prototype, "change", void 0);
    tslib_1.__decorate([
        Output('dfFocus'),
        tslib_1.__metadata("design:type", EventEmitter)
    ], DsDynamicFormComponent.prototype, "focus", void 0);
    tslib_1.__decorate([
        Output('ngbEvent'),
        tslib_1.__metadata("design:type", EventEmitter)
    ], DsDynamicFormComponent.prototype, "customEvent", void 0);
    tslib_1.__decorate([
        ContentChildren(DynamicTemplateDirective),
        tslib_1.__metadata("design:type", QueryList)
    ], DsDynamicFormComponent.prototype, "templates", void 0);
    tslib_1.__decorate([
        ViewChildren(DsDynamicFormControlContainerComponent),
        tslib_1.__metadata("design:type", QueryList)
    ], DsDynamicFormComponent.prototype, "components", void 0);
    DsDynamicFormComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-dynamic-form',
            templateUrl: './ds-dynamic-form.component.html'
        }),
        tslib_1.__metadata("design:paramtypes", [FormBuilderService, DynamicFormLayoutService])
    ], DsDynamicFormComponent);
    return DsDynamicFormComponent;
}(DynamicFormComponent));
export { DsDynamicFormComponent };
//# sourceMappingURL=ds-dynamic-form.component.js.map