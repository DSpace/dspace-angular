import * as tslib_1 from "tslib";
import { ChangeDetectorRef, Component, EventEmitter, Inject, Input, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { combineLatest, of as observableOf } from 'rxjs';
import { filter, flatMap, map, mergeMap, scan } from 'rxjs/operators';
import { DynamicFormControlComponent, DynamicFormLayoutService, DynamicFormValidationService } from '@ng-dynamic-forms/core';
import { isEqual, isObject } from 'lodash';
import { DynamicRelationGroupModel, PLACEHOLDER_PARENT_METADATA } from './dynamic-relation-group.model';
import { FormBuilderService } from '../../../form-builder.service';
import { FormService } from '../../../../form.service';
import { FormComponent } from '../../../../form.component';
import { Chips } from '../../../../../chips/models/chips.model';
import { hasValue, isEmpty, isNotEmpty, isNotNull } from '../../../../../empty.util';
import { shrinkInOut } from '../../../../../animations/shrink';
import { GLOBAL_CONFIG } from '../../../../../../../config';
import { hasOnlyEmptyProperties } from '../../../../../object.util';
import { IntegrationSearchOptions } from '../../../../../../core/integration/models/integration-options.model';
import { AuthorityService } from '../../../../../../core/integration/authority.service';
import { FormFieldMetadataValueObject } from '../../../models/form-field-metadata-value.model';
var DsDynamicRelationGroupComponent = /** @class */ (function (_super) {
    tslib_1.__extends(DsDynamicRelationGroupComponent, _super);
    function DsDynamicRelationGroupComponent(EnvConfig, authorityService, formBuilderService, formService, cdr, layoutService, validationService) {
        var _this = _super.call(this, layoutService, validationService) || this;
        _this.EnvConfig = EnvConfig;
        _this.authorityService = authorityService;
        _this.formBuilderService = formBuilderService;
        _this.formService = formService;
        _this.cdr = cdr;
        _this.layoutService = layoutService;
        _this.validationService = validationService;
        _this.blur = new EventEmitter();
        _this.change = new EventEmitter();
        _this.focus = new EventEmitter();
        _this.formCollapsed = observableOf(false);
        _this.editMode = false;
        _this.subs = [];
        return _this;
    }
    DsDynamicRelationGroupComponent.prototype.ngOnInit = function () {
        var _this = this;
        var config = { rows: this.model.formConfiguration };
        if (!this.model.isEmpty()) {
            this.formCollapsed = observableOf(true);
        }
        this.model.valueUpdates.subscribe(function (value) {
            if ((isNotEmpty(value) && !(value.length === 1 && hasOnlyEmptyProperties(value[0])))) {
                _this.collapseForm();
            }
            else {
                _this.expandForm();
            }
        });
        this.formId = this.formService.getUniqueId(this.model.id);
        this.formModel = this.formBuilderService.modelFromConfiguration(config, this.model.scopeUUID, {}, this.model.submissionScope, this.model.readOnly);
        this.initChipsFromModelValue();
    };
    DsDynamicRelationGroupComponent.prototype.isMandatoryFieldEmpty = function () {
        var _this = this;
        var res = true;
        this.formModel.forEach(function (row) {
            var modelRow = row;
            modelRow.group.forEach(function (model) {
                if (model.name === _this.model.mandatoryField) {
                    res = model.value == null;
                    return;
                }
            });
        });
        return res;
    };
    DsDynamicRelationGroupComponent.prototype.onBlur = function (event) {
        this.blur.emit();
    };
    DsDynamicRelationGroupComponent.prototype.onChipSelected = function (event) {
        var _this = this;
        this.expandForm();
        this.selectedChipItem = this.chips.getChipByIndex(event);
        this.formModel.forEach(function (row) {
            var modelRow = row;
            modelRow.group.forEach(function (model) {
                var value = (_this.selectedChipItem.item[model.name] === PLACEHOLDER_PARENT_METADATA
                    || _this.selectedChipItem.item[model.name].value === PLACEHOLDER_PARENT_METADATA)
                    ? null
                    : _this.selectedChipItem.item[model.name];
                if (isNotNull(value)) {
                    model.valueUpdates.next(_this.formBuilderService.isInputModel(model) ? value.value : value);
                }
            });
        });
        this.editMode = true;
    };
    DsDynamicRelationGroupComponent.prototype.onFocus = function (event) {
        this.focus.emit(event);
    };
    DsDynamicRelationGroupComponent.prototype.collapseForm = function () {
        this.formCollapsed = observableOf(true);
        this.clear();
    };
    DsDynamicRelationGroupComponent.prototype.expandForm = function () {
        this.formCollapsed = observableOf(false);
    };
    DsDynamicRelationGroupComponent.prototype.clear = function () {
        if (this.editMode) {
            this.selectedChipItem.editMode = false;
            this.selectedChipItem = null;
            this.editMode = false;
        }
        this.resetForm();
        if (!this.model.isEmpty()) {
            this.formCollapsed = observableOf(true);
        }
    };
    DsDynamicRelationGroupComponent.prototype.save = function () {
        if (this.editMode) {
            this.modifyChip();
        }
        else {
            this.addToChips();
        }
    };
    DsDynamicRelationGroupComponent.prototype.delete = function () {
        this.chips.remove(this.selectedChipItem);
        this.clear();
    };
    DsDynamicRelationGroupComponent.prototype.addToChips = function () {
        if (!this.formRef.formGroup.valid) {
            this.formService.validateAllFormFields(this.formRef.formGroup);
            return;
        }
        // Item to add
        if (!this.isMandatoryFieldEmpty()) {
            var item = this.buildChipItem();
            this.chips.add(item);
            this.resetForm();
        }
    };
    DsDynamicRelationGroupComponent.prototype.modifyChip = function () {
        if (!this.formRef.formGroup.valid) {
            this.formService.validateAllFormFields(this.formRef.formGroup);
            return;
        }
        if (!this.isMandatoryFieldEmpty()) {
            var item = this.buildChipItem();
            this.chips.update(this.selectedChipItem.id, item);
            this.resetForm();
            this.cdr.detectChanges();
        }
    };
    DsDynamicRelationGroupComponent.prototype.buildChipItem = function () {
        var item = Object.create({});
        this.formModel.forEach(function (row) {
            var modelRow = row;
            modelRow.group.forEach(function (control) {
                item[control.name] = control.value || PLACEHOLDER_PARENT_METADATA;
            });
        });
        return item;
    };
    DsDynamicRelationGroupComponent.prototype.initChipsFromModelValue = function () {
        var _this = this;
        var initChipsValue$;
        if (this.model.isEmpty()) {
            this.initChips([]);
        }
        else {
            initChipsValue$ = observableOf(this.model.value);
            // If authority
            this.subs.push(initChipsValue$.pipe(flatMap(function (valueModel) {
                var returnList = [];
                valueModel.forEach(function (valueObj) {
                    var returnObj = Object.keys(valueObj).map(function (fieldName) {
                        var return$;
                        if (isObject(valueObj[fieldName]) && valueObj[fieldName].hasAuthority() && isNotEmpty(valueObj[fieldName].authority)) {
                            var fieldId = fieldName.replace(/\./g, '_');
                            var model = _this.formBuilderService.findById(fieldId, _this.formModel);
                            var searchOptions = new IntegrationSearchOptions(model.authorityOptions.scope, model.authorityOptions.name, model.authorityOptions.metadata, valueObj[fieldName].authority, model.maxOptions, 1);
                            return$ = _this.authorityService.getEntryByValue(searchOptions).pipe(map(function (result) { return Object.assign(new FormFieldMetadataValueObject(), valueObj[fieldName], {
                                otherInformation: result.payload[0].otherInformation
                            }); }));
                        }
                        else {
                            return$ = observableOf(valueObj[fieldName]);
                        }
                        return return$.pipe(map(function (entry) {
                            var _a;
                            return (_a = {}, _a[fieldName] = entry, _a);
                        }));
                    });
                    returnList.push(combineLatest(returnObj));
                });
                return returnList;
            }), mergeMap(function (valueListObj, index) {
                return valueListObj.pipe(map(function (valueObj) { return ({
                    index: index, value: valueObj.reduce(function (acc, value) { return Object.assign({}, acc, value); })
                }); }));
            }), scan(function (acc, valueObj) {
                if (acc.length === 0) {
                    acc.push(valueObj.value);
                }
                else {
                    acc.splice(valueObj.index, 0, valueObj.value);
                }
                return acc;
            }, []), filter(function (modelValues) { return _this.model.value.length === modelValues.length; })).subscribe(function (modelValue) {
                _this.model.valueUpdates.next(modelValue);
                _this.initChips(modelValue);
                _this.cdr.markForCheck();
            }));
        }
    };
    DsDynamicRelationGroupComponent.prototype.initChips = function (initChipsValue) {
        var _this = this;
        this.chips = new Chips(initChipsValue, 'value', this.model.mandatoryField, this.EnvConfig.submission.icons.metadata);
        this.subs.push(this.chips.chipsItems
            .subscribe(function () {
            var items = _this.chips.getChipsItems();
            // Does not emit change if model value is equal to the current value
            if (!isEqual(items, _this.model.value)) {
                if (!(isEmpty(items) && _this.model.isEmpty())) {
                    _this.model.valueUpdates.next(items);
                    _this.change.emit();
                }
            }
        }));
    };
    DsDynamicRelationGroupComponent.prototype.resetForm = function () {
        if (this.formRef) {
            this.formService.resetForm(this.formRef.formGroup, this.formModel, this.formId);
        }
    };
    DsDynamicRelationGroupComponent.prototype.ngOnDestroy = function () {
        this.subs
            .filter(function (sub) { return hasValue(sub); })
            .forEach(function (sub) { return sub.unsubscribe(); });
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], DsDynamicRelationGroupComponent.prototype, "formId", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", FormGroup)
    ], DsDynamicRelationGroupComponent.prototype, "group", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", DynamicRelationGroupModel)
    ], DsDynamicRelationGroupComponent.prototype, "model", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], DsDynamicRelationGroupComponent.prototype, "blur", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], DsDynamicRelationGroupComponent.prototype, "change", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], DsDynamicRelationGroupComponent.prototype, "focus", void 0);
    tslib_1.__decorate([
        ViewChild('formRef'),
        tslib_1.__metadata("design:type", FormComponent)
    ], DsDynamicRelationGroupComponent.prototype, "formRef", void 0);
    DsDynamicRelationGroupComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-dynamic-relation-group',
            styleUrls: ['./dynamic-relation-group.component.scss'],
            templateUrl: './dynamic-relation-group.component.html',
            animations: [shrinkInOut]
        }),
        tslib_1.__param(0, Inject(GLOBAL_CONFIG)),
        tslib_1.__metadata("design:paramtypes", [Object, AuthorityService,
            FormBuilderService,
            FormService,
            ChangeDetectorRef,
            DynamicFormLayoutService,
            DynamicFormValidationService])
    ], DsDynamicRelationGroupComponent);
    return DsDynamicRelationGroupComponent;
}(DynamicFormControlComponent));
export { DsDynamicRelationGroupComponent };
//# sourceMappingURL=dynamic-relation-group.components.js.map