import * as tslib_1 from "tslib";
import { ChangeDetectionStrategy, Component, ComponentFactoryResolver, ContentChildren, EventEmitter, Input, Output, QueryList, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DYNAMIC_FORM_CONTROL_TYPE_ARRAY, DYNAMIC_FORM_CONTROL_TYPE_CHECKBOX, DYNAMIC_FORM_CONTROL_TYPE_CHECKBOX_GROUP, DYNAMIC_FORM_CONTROL_TYPE_DATEPICKER, DYNAMIC_FORM_CONTROL_TYPE_GROUP, DYNAMIC_FORM_CONTROL_TYPE_INPUT, DYNAMIC_FORM_CONTROL_TYPE_RADIO_GROUP, DYNAMIC_FORM_CONTROL_TYPE_SELECT, DYNAMIC_FORM_CONTROL_TYPE_TEXTAREA, DYNAMIC_FORM_CONTROL_TYPE_TIMEPICKER, DynamicFormControlContainerComponent, DynamicFormLayoutService, DynamicFormValidationService, DynamicTemplateDirective, } from '@ng-dynamic-forms/core';
import { DynamicNGBootstrapCalendarComponent, DynamicNGBootstrapCheckboxComponent, DynamicNGBootstrapCheckboxGroupComponent, DynamicNGBootstrapInputComponent, DynamicNGBootstrapRadioGroupComponent, DynamicNGBootstrapSelectComponent, DynamicNGBootstrapTextAreaComponent, DynamicNGBootstrapTimePickerComponent } from '@ng-dynamic-forms/ui-ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { DYNAMIC_FORM_CONTROL_TYPE_TYPEAHEAD } from './models/typeahead/dynamic-typeahead.model';
import { DYNAMIC_FORM_CONTROL_TYPE_SCROLLABLE_DROPDOWN } from './models/scrollable-dropdown/dynamic-scrollable-dropdown.model';
import { DYNAMIC_FORM_CONTROL_TYPE_TAG } from './models/tag/dynamic-tag.model';
import { DYNAMIC_FORM_CONTROL_TYPE_DSDATEPICKER } from './models/date-picker/date-picker.model';
import { DYNAMIC_FORM_CONTROL_TYPE_LOOKUP } from './models/lookup/dynamic-lookup.model';
import { DynamicListCheckboxGroupModel } from './models/list/dynamic-list-checkbox-group.model';
import { DynamicListRadioGroupModel } from './models/list/dynamic-list-radio-group.model';
import { isNotEmpty, isNotUndefined } from '../../../empty.util';
import { DYNAMIC_FORM_CONTROL_TYPE_LOOKUP_NAME } from './models/lookup/dynamic-lookup-name.model';
import { DsDynamicTagComponent } from './models/tag/dynamic-tag.component';
import { DsDatePickerComponent } from './models/date-picker/date-picker.component';
import { DsDynamicListComponent } from './models/list/dynamic-list.component';
import { DsDynamicTypeaheadComponent } from './models/typeahead/dynamic-typeahead.component';
import { DsDynamicScrollableDropdownComponent } from './models/scrollable-dropdown/dynamic-scrollable-dropdown.component';
import { DsDynamicLookupComponent } from './models/lookup/dynamic-lookup.component';
import { DsDynamicFormGroupComponent } from './models/form-group/dynamic-form-group.component';
import { DsDynamicFormArrayComponent } from './models/array-group/dynamic-form-array.component';
import { DsDynamicRelationGroupComponent } from './models/relation-group/dynamic-relation-group.components';
import { DYNAMIC_FORM_CONTROL_TYPE_RELATION_GROUP } from './models/relation-group/dynamic-relation-group.model';
import { DsDatePickerInlineComponent } from './models/date-picker-inline/dynamic-date-picker-inline.component';
export function dsDynamicFormControlMapFn(model) {
    switch (model.type) {
        case DYNAMIC_FORM_CONTROL_TYPE_ARRAY:
            return DsDynamicFormArrayComponent;
        case DYNAMIC_FORM_CONTROL_TYPE_CHECKBOX:
            return DynamicNGBootstrapCheckboxComponent;
        case DYNAMIC_FORM_CONTROL_TYPE_CHECKBOX_GROUP:
            return (model instanceof DynamicListCheckboxGroupModel) ? DsDynamicListComponent : DynamicNGBootstrapCheckboxGroupComponent;
        case DYNAMIC_FORM_CONTROL_TYPE_DATEPICKER:
            var datepickerModel = model;
            return datepickerModel.inline ? DynamicNGBootstrapCalendarComponent : DsDatePickerInlineComponent;
        case DYNAMIC_FORM_CONTROL_TYPE_GROUP:
            return DsDynamicFormGroupComponent;
        case DYNAMIC_FORM_CONTROL_TYPE_INPUT:
            return DynamicNGBootstrapInputComponent;
        case DYNAMIC_FORM_CONTROL_TYPE_RADIO_GROUP:
            return (model instanceof DynamicListRadioGroupModel) ? DsDynamicListComponent : DynamicNGBootstrapRadioGroupComponent;
        case DYNAMIC_FORM_CONTROL_TYPE_SELECT:
            return DynamicNGBootstrapSelectComponent;
        case DYNAMIC_FORM_CONTROL_TYPE_TEXTAREA:
            return DynamicNGBootstrapTextAreaComponent;
        case DYNAMIC_FORM_CONTROL_TYPE_TIMEPICKER:
            return DynamicNGBootstrapTimePickerComponent;
        case DYNAMIC_FORM_CONTROL_TYPE_TYPEAHEAD:
            return DsDynamicTypeaheadComponent;
        case DYNAMIC_FORM_CONTROL_TYPE_SCROLLABLE_DROPDOWN:
            return DsDynamicScrollableDropdownComponent;
        case DYNAMIC_FORM_CONTROL_TYPE_TAG:
            return DsDynamicTagComponent;
        case DYNAMIC_FORM_CONTROL_TYPE_RELATION_GROUP:
            return DsDynamicRelationGroupComponent;
        case DYNAMIC_FORM_CONTROL_TYPE_DSDATEPICKER:
            return DsDatePickerComponent;
        case DYNAMIC_FORM_CONTROL_TYPE_LOOKUP:
            return DsDynamicLookupComponent;
        case DYNAMIC_FORM_CONTROL_TYPE_LOOKUP_NAME:
            return DsDynamicLookupComponent;
        default:
            return null;
    }
}
var DsDynamicFormControlContainerComponent = /** @class */ (function (_super) {
    tslib_1.__extends(DsDynamicFormControlContainerComponent, _super);
    function DsDynamicFormControlContainerComponent(componentFactoryResolver, layoutService, validationService, translateService) {
        var _this = _super.call(this, componentFactoryResolver, layoutService, validationService) || this;
        _this.componentFactoryResolver = componentFactoryResolver;
        _this.layoutService = layoutService;
        _this.validationService = validationService;
        _this.translateService = translateService;
        _this.asBootstrapFormGroup = true;
        _this.bindId = true;
        _this.context = null;
        _this.hasErrorMessaging = false;
        _this.layout = null;
        /* tslint:disable:no-output-rename */
        _this.blur = new EventEmitter();
        _this.change = new EventEmitter();
        _this.focus = new EventEmitter();
        _this.customEvent = new EventEmitter();
        return _this;
    }
    Object.defineProperty(DsDynamicFormControlContainerComponent.prototype, "componentType", {
        get: function () {
            return this.layoutService.getCustomComponentType(this.model) || dsDynamicFormControlMapFn(this.model);
        },
        enumerable: true,
        configurable: true
    });
    DsDynamicFormControlContainerComponent.prototype.ngOnChanges = function (changes) {
        if (changes) {
            _super.prototype.ngOnChanges.call(this, changes);
            if (this.model && this.model.placeholder) {
                this.model.placeholder = this.translateService.instant(this.model.placeholder);
            }
        }
    };
    DsDynamicFormControlContainerComponent.prototype.ngDoCheck = function () {
        if (isNotUndefined(this.showErrorMessagesPreviousStage) && this.showErrorMessagesPreviousStage !== this.showErrorMessages) {
            this.showErrorMessagesPreviousStage = this.showErrorMessages;
            this.forceShowErrorDetection();
        }
    };
    DsDynamicFormControlContainerComponent.prototype.ngAfterViewInit = function () {
        this.showErrorMessagesPreviousStage = this.showErrorMessages;
    };
    /**
     * Since Form Control Components created dynamically have 'OnPush' change detection strategy,
     * changes are not propagated. So use this method to force an update
     */
    DsDynamicFormControlContainerComponent.prototype.forceShowErrorDetection = function () {
        if (this.showErrorMessages) {
            this.destroyFormControlComponent();
            this.createFormControlComponent();
        }
    };
    DsDynamicFormControlContainerComponent.prototype.onChangeLanguage = function (event) {
        if (isNotEmpty(this.model.value)) {
            this.onChange(event);
        }
    };
    tslib_1.__decorate([
        ContentChildren(DynamicTemplateDirective),
        tslib_1.__metadata("design:type", QueryList)
    ], DsDynamicFormControlContainerComponent.prototype, "contentTemplateList", void 0);
    tslib_1.__decorate([
        Input('templates'),
        tslib_1.__metadata("design:type", QueryList)
    ], DsDynamicFormControlContainerComponent.prototype, "inputTemplateList", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], DsDynamicFormControlContainerComponent.prototype, "formId", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], DsDynamicFormControlContainerComponent.prototype, "asBootstrapFormGroup", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], DsDynamicFormControlContainerComponent.prototype, "bindId", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], DsDynamicFormControlContainerComponent.prototype, "context", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", FormGroup)
    ], DsDynamicFormControlContainerComponent.prototype, "group", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], DsDynamicFormControlContainerComponent.prototype, "hasErrorMessaging", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], DsDynamicFormControlContainerComponent.prototype, "layout", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], DsDynamicFormControlContainerComponent.prototype, "model", void 0);
    tslib_1.__decorate([
        Output('dfBlur'),
        tslib_1.__metadata("design:type", EventEmitter)
    ], DsDynamicFormControlContainerComponent.prototype, "blur", void 0);
    tslib_1.__decorate([
        Output('dfChange'),
        tslib_1.__metadata("design:type", EventEmitter)
    ], DsDynamicFormControlContainerComponent.prototype, "change", void 0);
    tslib_1.__decorate([
        Output('dfFocus'),
        tslib_1.__metadata("design:type", EventEmitter)
    ], DsDynamicFormControlContainerComponent.prototype, "focus", void 0);
    tslib_1.__decorate([
        Output('ngbEvent'),
        tslib_1.__metadata("design:type", EventEmitter)
    ], DsDynamicFormControlContainerComponent.prototype, "customEvent", void 0);
    tslib_1.__decorate([
        ViewChild('componentViewContainer', { read: ViewContainerRef }),
        tslib_1.__metadata("design:type", ViewContainerRef)
    ], DsDynamicFormControlContainerComponent.prototype, "componentViewContainerRef", void 0);
    DsDynamicFormControlContainerComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-dynamic-form-control-container',
            styleUrls: ['./ds-dynamic-form-control-container.component.scss'],
            templateUrl: './ds-dynamic-form-control-container.component.html',
            changeDetection: ChangeDetectionStrategy.Default
        }),
        tslib_1.__metadata("design:paramtypes", [ComponentFactoryResolver,
            DynamicFormLayoutService,
            DynamicFormValidationService,
            TranslateService])
    ], DsDynamicFormControlContainerComponent);
    return DsDynamicFormControlContainerComponent;
}(DynamicFormControlContainerComponent));
export { DsDynamicFormControlContainerComponent };
//# sourceMappingURL=ds-dynamic-form-control-container.component.js.map