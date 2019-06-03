import * as tslib_1 from "tslib";
import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { of as observableOf } from 'rxjs';
import { catchError, distinctUntilChanged } from 'rxjs/operators';
import { DynamicFormControlComponent, DynamicFormLayoutService, DynamicFormValidationService } from '@ng-dynamic-forms/core';
import { AuthorityService } from '../../../../../../core/integration/authority.service';
import { IntegrationSearchOptions } from '../../../../../../core/integration/models/integration-options.model';
import { hasValue, isEmpty, isNotEmpty, isNull, isUndefined } from '../../../../../empty.util';
import { IntegrationData } from '../../../../../../core/integration/integration-data';
import { PageInfo } from '../../../../../../core/shared/page-info.model';
import { FormFieldMetadataValueObject } from '../../../models/form-field-metadata-value.model';
import { AuthorityValue } from '../../../../../../core/integration/models/authority.value';
import { DynamicLookupNameModel } from './dynamic-lookup-name.model';
var DsDynamicLookupComponent = /** @class */ (function (_super) {
    tslib_1.__extends(DsDynamicLookupComponent, _super);
    function DsDynamicLookupComponent(authorityService, cdr, layoutService, validationService) {
        var _this = _super.call(this, layoutService, validationService) || this;
        _this.authorityService = authorityService;
        _this.cdr = cdr;
        _this.layoutService = layoutService;
        _this.validationService = validationService;
        _this.bindId = true;
        _this.blur = new EventEmitter();
        _this.change = new EventEmitter();
        _this.focus = new EventEmitter();
        _this.editMode = false;
        _this.firstInputValue = '';
        _this.secondInputValue = '';
        _this.loading = false;
        _this.subs = [];
        _this.inputFormatter = function (x, y) {
            return y === 1 ? _this.firstInputValue : _this.secondInputValue;
        };
        return _this;
    }
    DsDynamicLookupComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.searchOptions = new IntegrationSearchOptions(this.model.authorityOptions.scope, this.model.authorityOptions.name, this.model.authorityOptions.metadata, '', this.model.maxOptions, 1);
        this.setInputsValue(this.model.value);
        this.subs.push(this.model.valueUpdates
            .subscribe(function (value) {
            if (isEmpty(value)) {
                _this.resetFields();
            }
            else if (!_this.editMode) {
                _this.setInputsValue(_this.model.value);
            }
        }));
    };
    DsDynamicLookupComponent.prototype.getCurrentValue = function () {
        var result = '';
        if (!this.isLookupName()) {
            result = this.firstInputValue;
        }
        else {
            if (isNotEmpty(this.firstInputValue)) {
                result = this.firstInputValue;
            }
            if (isNotEmpty(this.secondInputValue)) {
                result = isEmpty(result)
                    ? this.secondInputValue
                    : this.firstInputValue + this.model.separator + ' ' + this.secondInputValue;
            }
        }
        return result;
    };
    DsDynamicLookupComponent.prototype.resetFields = function () {
        this.firstInputValue = '';
        if (this.isLookupName()) {
            this.secondInputValue = '';
        }
    };
    DsDynamicLookupComponent.prototype.setInputsValue = function (value) {
        if (hasValue(value)) {
            var displayValue = value;
            if (value instanceof FormFieldMetadataValueObject || value instanceof AuthorityValue) {
                displayValue = value.display;
            }
            if (hasValue(displayValue)) {
                if (this.isLookupName()) {
                    var values = displayValue.split(this.model.separator);
                    this.firstInputValue = (values[0] || '').trim();
                    this.secondInputValue = (values[1] || '').trim();
                }
                else {
                    this.firstInputValue = displayValue || '';
                }
            }
        }
    };
    DsDynamicLookupComponent.prototype.formatItemForInput = function (item, field) {
        if (isUndefined(item) || isNull(item)) {
            return '';
        }
        return (typeof item === 'string') ? item : this.inputFormatter(item, field);
    };
    DsDynamicLookupComponent.prototype.hasAuthorityValue = function () {
        return hasValue(this.model.value)
            && this.model.value.hasAuthority();
    };
    DsDynamicLookupComponent.prototype.hasEmptyValue = function () {
        return isNotEmpty(this.getCurrentValue());
    };
    DsDynamicLookupComponent.prototype.clearFields = function () {
        // Clear inputs whether there is no results and authority is closed
        if (this.model.authorityOptions.closed) {
            this.resetFields();
        }
    };
    DsDynamicLookupComponent.prototype.isEditDisabled = function () {
        return !this.hasAuthorityValue();
    };
    DsDynamicLookupComponent.prototype.isInputDisabled = function () {
        return (this.model.authorityOptions.closed && this.hasAuthorityValue() && !this.editMode);
    };
    DsDynamicLookupComponent.prototype.isLookupName = function () {
        return (this.model instanceof DynamicLookupNameModel);
    };
    DsDynamicLookupComponent.prototype.isSearchDisabled = function () {
        return isEmpty(this.firstInputValue);
    };
    DsDynamicLookupComponent.prototype.onBlurEvent = function (event) {
        this.blur.emit(event);
    };
    DsDynamicLookupComponent.prototype.onFocusEvent = function (event) {
        this.focus.emit(event);
    };
    DsDynamicLookupComponent.prototype.onInput = function (event) {
        if (!this.model.authorityOptions.closed) {
            if (isNotEmpty(this.getCurrentValue())) {
                var currentValue = new FormFieldMetadataValueObject(this.getCurrentValue());
                if (!this.editMode) {
                    this.onSelect(currentValue);
                }
            }
            else {
                this.remove();
            }
        }
    };
    DsDynamicLookupComponent.prototype.onScroll = function () {
        if (!this.loading && this.pageInfo.currentPage <= this.pageInfo.totalPages) {
            this.searchOptions.currentPage++;
            this.search();
        }
    };
    DsDynamicLookupComponent.prototype.onSelect = function (event) {
        this.group.markAsDirty();
        this.model.valueUpdates.next(event);
        this.setInputsValue(event);
        this.change.emit(event);
        this.optionsList = null;
        this.pageInfo = null;
    };
    DsDynamicLookupComponent.prototype.openChange = function (isOpened) {
        if (!isOpened) {
            if (this.model.authorityOptions.closed && !this.hasAuthorityValue()) {
                this.setInputsValue('');
            }
        }
    };
    DsDynamicLookupComponent.prototype.remove = function () {
        this.group.markAsPristine();
        this.model.valueUpdates.next(null);
        this.change.emit(null);
    };
    DsDynamicLookupComponent.prototype.saveChanges = function () {
        if (isNotEmpty(this.getCurrentValue())) {
            var newValue = Object.assign(new AuthorityValue(), this.model.value, {
                display: this.getCurrentValue(),
                value: this.getCurrentValue()
            });
            this.onSelect(newValue);
        }
        else {
            this.remove();
        }
        this.switchEditMode();
    };
    DsDynamicLookupComponent.prototype.search = function () {
        var _this = this;
        this.optionsList = null;
        this.pageInfo = null;
        // Query
        this.searchOptions.query = this.getCurrentValue();
        this.loading = true;
        this.subs.push(this.authorityService.getEntriesByName(this.searchOptions).pipe(catchError(function () {
            var emptyResult = new IntegrationData(new PageInfo(), []);
            return observableOf(emptyResult);
        }), distinctUntilChanged())
            .subscribe(function (object) {
            _this.optionsList = object.payload;
            _this.pageInfo = object.pageInfo;
            _this.loading = false;
            _this.cdr.detectChanges();
        }));
    };
    DsDynamicLookupComponent.prototype.switchEditMode = function () {
        this.editMode = !this.editMode;
    };
    DsDynamicLookupComponent.prototype.whenClickOnConfidenceNotAccepted = function (sdRef, confidence) {
        if (!this.model.readOnly) {
            sdRef.open();
            this.search();
        }
    };
    DsDynamicLookupComponent.prototype.ngOnDestroy = function () {
        this.subs
            .filter(function (sub) { return hasValue(sub); })
            .forEach(function (sub) { return sub.unsubscribe(); });
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], DsDynamicLookupComponent.prototype, "bindId", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", FormGroup)
    ], DsDynamicLookupComponent.prototype, "group", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], DsDynamicLookupComponent.prototype, "model", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], DsDynamicLookupComponent.prototype, "blur", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], DsDynamicLookupComponent.prototype, "change", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], DsDynamicLookupComponent.prototype, "focus", void 0);
    DsDynamicLookupComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-dynamic-lookup',
            styleUrls: ['./dynamic-lookup.component.scss'],
            templateUrl: './dynamic-lookup.component.html'
        }),
        tslib_1.__metadata("design:paramtypes", [AuthorityService,
            ChangeDetectorRef,
            DynamicFormLayoutService,
            DynamicFormValidationService])
    ], DsDynamicLookupComponent);
    return DsDynamicLookupComponent;
}(DynamicFormControlComponent));
export { DsDynamicLookupComponent };
//# sourceMappingURL=dynamic-lookup.component.js.map