import * as tslib_1 from "tslib";
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Location } from '@angular/common';
import { DynamicFormService } from '@ng-dynamic-forms/core';
import { TranslateService } from '@ngx-translate/core';
import { isNotEmpty } from '../../empty.util';
import { ResourceType } from '../../../core/shared/resource-type';
/**
 * A form for creating and editing Communities or Collections
 */
var ComColFormComponent = /** @class */ (function () {
    function ComColFormComponent(location, formService, translate) {
        this.location = location;
        this.formService = formService;
        this.translate = translate;
        /**
         * @type {string} Key prefix used to generate form labels
         */
        this.LABEL_KEY_PREFIX = '.form.';
        /**
         * @type {string} Key prefix used to generate form error messages
         */
        this.ERROR_KEY_PREFIX = '.form.errors.';
        /**
         * Emits DSO when the form is submitted
         * @type {EventEmitter<any>}
         */
        this.submitForm = new EventEmitter();
    }
    ComColFormComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.formModel.forEach(function (fieldModel) {
            fieldModel.value = _this.dso.firstMetadataValue(fieldModel.name);
        });
        this.formGroup = this.formService.createFormGroup(this.formModel);
        this.updateFieldTranslations();
        this.translate.onLangChange
            .subscribe(function () {
            _this.updateFieldTranslations();
        });
    };
    /**
     * Checks which new fields were added and sends the updated version of the DSO to the parent component
     */
    ComColFormComponent.prototype.onSubmit = function () {
        var formMetadata = new Object();
        this.formModel.forEach(function (fieldModel) {
            var value = {
                value: fieldModel.value,
                language: null
            };
            if (formMetadata.hasOwnProperty(fieldModel.name)) {
                formMetadata[fieldModel.name].push(value);
            }
            else {
                formMetadata[fieldModel.name] = [value];
            }
        });
        var updatedDSO = Object.assign({}, this.dso, {
            metadata: tslib_1.__assign({}, this.dso.metadata, formMetadata),
            type: ResourceType.Community
        });
        this.submitForm.emit(updatedDSO);
    };
    /**
     * Used the update translations of errors and labels on init and on language change
     */
    ComColFormComponent.prototype.updateFieldTranslations = function () {
        var _this = this;
        this.formModel.forEach(function (fieldModel) {
            fieldModel.label = _this.translate.instant(_this.type + _this.LABEL_KEY_PREFIX + fieldModel.id);
            if (isNotEmpty(fieldModel.validators)) {
                fieldModel.errorMessages = {};
                Object.keys(fieldModel.validators).forEach(function (key) {
                    fieldModel.errorMessages[key] = _this.translate.instant(_this.type + _this.ERROR_KEY_PREFIX + fieldModel.id + '.' + key);
                });
            }
        });
    };
    ComColFormComponent.prototype.onCancel = function () {
        this.location.back();
    };
    var _a;
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", typeof (_a = typeof T !== "undefined" && T) === "function" && _a || Object)
    ], ComColFormComponent.prototype, "dso", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], ComColFormComponent.prototype, "submitForm", void 0);
    ComColFormComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-comcol-form',
            styleUrls: ['./comcol-form.component.scss'],
            templateUrl: './comcol-form.component.html'
        }),
        tslib_1.__metadata("design:paramtypes", [Location,
            DynamicFormService,
            TranslateService])
    ], ComColFormComponent);
    return ComColFormComponent;
}());
export { ComColFormComponent };
//# sourceMappingURL=comcol-form.component.js.map