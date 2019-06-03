import * as tslib_1 from "tslib";
import { ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';
import { DYNAMIC_FORM_CONTROL_TYPE_DATEPICKER, DynamicDatePickerModel, DynamicFormArrayModel, DynamicFormGroupModel, DynamicSelectModel } from '@ng-dynamic-forms/core';
import { WorkspaceitemSectionUploadFileObject } from '../../../../../core/submission/models/workspaceitem-section-upload-file.model';
import { FormBuilderService } from '../../../../../shared/form/builder/form-builder.service';
import { BITSTREAM_ACCESS_CONDITIONS_FORM_ARRAY_CONFIG, BITSTREAM_ACCESS_CONDITIONS_FORM_ARRAY_LAYOUT, BITSTREAM_FORM_ACCESS_CONDITION_END_DATE_CONFIG, BITSTREAM_FORM_ACCESS_CONDITION_END_DATE_LAYOUT, BITSTREAM_FORM_ACCESS_CONDITION_GROUPS_CONFIG, BITSTREAM_FORM_ACCESS_CONDITION_GROUPS_LAYOUT, BITSTREAM_FORM_ACCESS_CONDITION_START_DATE_CONFIG, BITSTREAM_FORM_ACCESS_CONDITION_START_DATE_LAYOUT, BITSTREAM_FORM_ACCESS_CONDITION_TYPE_CONFIG, BITSTREAM_FORM_ACCESS_CONDITION_TYPE_LAYOUT, BITSTREAM_METADATA_FORM_GROUP_CONFIG, BITSTREAM_METADATA_FORM_GROUP_LAYOUT } from './section-upload-file-edit.model';
import { POLICY_DEFAULT_WITH_LIST } from '../../section-upload.component';
import { isNotEmpty, isNotUndefined } from '../../../../../shared/empty.util';
import { SubmissionFormsModel } from '../../../../../core/config/models/config-submission-forms.model';
import { SubmissionService } from '../../../../submission.service';
import { FormService } from '../../../../../shared/form/form.service';
import { FormComponent } from '../../../../../shared/form/form.component';
/**
 * This component represents the edit form for bitstream
 */
var SubmissionSectionUploadFileEditComponent = /** @class */ (function () {
    /**
     * Initialize instance variables
     *
     * @param {ChangeDetectorRef} cdr
     * @param {FormBuilderService} formBuilderService
     * @param {FormService} formService
     * @param {SubmissionService} submissionService
     */
    function SubmissionSectionUploadFileEditComponent(cdr, formBuilderService, formService, submissionService) {
        this.cdr = cdr;
        this.formBuilderService = formBuilderService;
        this.formService = formService;
        this.submissionService = submissionService;
    }
    /**
     * Dispatch form model init
     */
    SubmissionSectionUploadFileEditComponent.prototype.ngOnChanges = function () {
        if (this.fileData && this.formId) {
            this.formModel = this.buildFileEditForm();
            this.cdr.detectChanges();
        }
    };
    /**
     * Initialize form model
     */
    SubmissionSectionUploadFileEditComponent.prototype.buildFileEditForm = function () {
        var configDescr = Object.assign({}, this.configMetadataForm.rows[0].fields[0]);
        configDescr.repeatable = false;
        var configForm = Object.assign({}, this.configMetadataForm, {
            fields: Object.assign([], this.configMetadataForm.rows[0].fields[0], [
                this.configMetadataForm.rows[0].fields[0],
                configDescr
            ])
        });
        var formModel = [];
        var metadataGroupModelConfig = Object.assign({}, BITSTREAM_METADATA_FORM_GROUP_CONFIG);
        metadataGroupModelConfig.group = this.formBuilderService.modelFromConfiguration(configForm, this.collectionId, this.fileData.metadata, this.submissionService.getSubmissionScope());
        formModel.push(new DynamicFormGroupModel(metadataGroupModelConfig, BITSTREAM_METADATA_FORM_GROUP_LAYOUT));
        var accessConditionTypeModelConfig = Object.assign({}, BITSTREAM_FORM_ACCESS_CONDITION_TYPE_CONFIG);
        var accessConditionsArrayConfig = Object.assign({}, BITSTREAM_ACCESS_CONDITIONS_FORM_ARRAY_CONFIG);
        var accessConditionTypeOptions = [];
        if (this.collectionPolicyType === POLICY_DEFAULT_WITH_LIST) {
            for (var _i = 0, _a = this.availableAccessConditionOptions; _i < _a.length; _i++) {
                var accessCondition = _a[_i];
                accessConditionTypeOptions.push({
                    label: accessCondition.name,
                    value: accessCondition.name
                });
            }
            accessConditionTypeModelConfig.options = accessConditionTypeOptions;
            // Dynamically assign of relation in config. For startdate, endDate, groups.
            var hasStart_1 = [];
            var hasEnd_1 = [];
            var hasGroups_1 = [];
            this.availableAccessConditionOptions.forEach(function (condition) {
                var showStart = condition.hasStartDate === true;
                var showEnd = condition.hasEndDate === true;
                var showGroups = showStart || showEnd;
                if (showStart) {
                    hasStart_1.push({ id: 'name', value: condition.name });
                }
                if (showEnd) {
                    hasEnd_1.push({ id: 'name', value: condition.name });
                }
                if (showGroups) {
                    hasGroups_1.push({ id: 'name', value: condition.name });
                }
            });
            var confStart_1 = { relation: [{ action: 'ENABLE', connective: 'OR', when: hasStart_1 }] };
            var confEnd_1 = { relation: [{ action: 'ENABLE', connective: 'OR', when: hasEnd_1 }] };
            var confGroup_1 = { relation: [{ action: 'ENABLE', connective: 'OR', when: hasGroups_1 }] };
            accessConditionsArrayConfig.groupFactory = function () {
                var type = new DynamicSelectModel(accessConditionTypeModelConfig, BITSTREAM_FORM_ACCESS_CONDITION_TYPE_LAYOUT);
                var startDateConfig = Object.assign({}, BITSTREAM_FORM_ACCESS_CONDITION_START_DATE_CONFIG, confStart_1);
                var endDateConfig = Object.assign({}, BITSTREAM_FORM_ACCESS_CONDITION_END_DATE_CONFIG, confEnd_1);
                var groupsConfig = Object.assign({}, BITSTREAM_FORM_ACCESS_CONDITION_GROUPS_CONFIG, confGroup_1);
                var startDate = new DynamicDatePickerModel(startDateConfig, BITSTREAM_FORM_ACCESS_CONDITION_START_DATE_LAYOUT);
                var endDate = new DynamicDatePickerModel(endDateConfig, BITSTREAM_FORM_ACCESS_CONDITION_END_DATE_LAYOUT);
                var groups = new DynamicSelectModel(groupsConfig, BITSTREAM_FORM_ACCESS_CONDITION_GROUPS_LAYOUT);
                return [type, startDate, endDate, groups];
            };
            // Number of access conditions blocks in form
            accessConditionsArrayConfig.initialCount = isNotEmpty(this.fileData.accessConditions) ? this.fileData.accessConditions.length : 1;
            formModel.push(new DynamicFormArrayModel(accessConditionsArrayConfig, BITSTREAM_ACCESS_CONDITIONS_FORM_ARRAY_LAYOUT));
        }
        this.initModelData(formModel);
        return formModel;
    };
    /**
     * Initialize form model values
     *
     * @param formModel
     *    The form model
     */
    SubmissionSectionUploadFileEditComponent.prototype.initModelData = function (formModel) {
        var _this = this;
        this.fileData.accessConditions.forEach(function (accessCondition, index) {
            Array.of('name', 'groupUUID', 'startDate', 'endDate')
                .filter(function (key) { return accessCondition.hasOwnProperty(key); })
                .forEach(function (key) {
                var metadataModel = _this.formBuilderService.findById(key, formModel, index);
                if (metadataModel) {
                    if (key === 'groupUUID' && _this.availableAccessConditionGroups.get(accessCondition.name)) {
                        _this.availableAccessConditionGroups.get(accessCondition.name).forEach(function (group) {
                            metadataModel.options.push({
                                label: group.name,
                                value: group.uuid
                            });
                        });
                    }
                    if (metadataModel.type === DYNAMIC_FORM_CONTROL_TYPE_DATEPICKER) {
                        var date = new Date(accessCondition[key]);
                        metadataModel.value = {
                            year: date.getFullYear(),
                            month: date.getMonth() + 1,
                            day: date.getDate()
                        };
                    }
                    else {
                        metadataModel.value = accessCondition[key];
                    }
                }
            });
        });
    };
    /**
     * Dispatch form model update when changing an access condition
     *
     * @param event
     *    The event emitted
     */
    SubmissionSectionUploadFileEditComponent.prototype.onChange = function (event) {
        if (event.model.id === 'name') {
            this.setOptions(event.model, event.control);
        }
    };
    /**
     * Update `startDate`, 'groupUUID' and 'endDate' model
     *
     * @param model
     *    The [[DynamicFormControlModel]] object
     * @param control
     *    The [[FormControl]] object
     */
    SubmissionSectionUploadFileEditComponent.prototype.setOptions = function (model, control) {
        var accessCondition = null;
        this.availableAccessConditionOptions.filter(function (element) { return element.name === control.value; })
            .forEach(function (element) { return accessCondition = element; });
        if (isNotEmpty(accessCondition)) {
            var showGroups = accessCondition.hasStartDate === true || accessCondition.hasEndDate === true;
            var groupControl = control.parent.get('groupUUID');
            var startDateControl = control.parent.get('startDate');
            var endDateControl = control.parent.get('endDate');
            // Clear previous state
            groupControl.markAsUntouched();
            startDateControl.markAsUntouched();
            endDateControl.markAsUntouched();
            // Clear previous values
            if (showGroups) {
                groupControl.setValue(null);
            }
            else {
                groupControl.clearValidators();
                groupControl.setValue(accessCondition.groupUUID);
            }
            startDateControl.setValue(null);
            control.parent.markAsDirty();
            endDateControl.setValue(null);
            if (showGroups) {
                if (isNotUndefined(accessCondition.groupUUID) || isNotUndefined(accessCondition.selectGroupUUID)) {
                    var groupOptions_1 = [];
                    if (isNotUndefined(this.availableAccessConditionGroups.get(accessCondition.name))) {
                        var groupModel = this.formBuilderService.findById('groupUUID', model.parent.group);
                        this.availableAccessConditionGroups.get(accessCondition.name).forEach(function (group) {
                            groupOptions_1.push({
                                label: group.name,
                                value: group.uuid
                            });
                        });
                        // Due to a bug can't dynamically change the select options, so replace the model with a new one
                        var confGroup = { relation: groupModel.relation };
                        var groupsConfig = Object.assign({}, BITSTREAM_FORM_ACCESS_CONDITION_GROUPS_CONFIG, confGroup);
                        groupsConfig.options = groupOptions_1;
                        model.parent.group.pop();
                        model.parent.group.push(new DynamicSelectModel(groupsConfig, BITSTREAM_FORM_ACCESS_CONDITION_GROUPS_LAYOUT));
                    }
                }
                if (accessCondition.hasStartDate) {
                    var startDateModel = this.formBuilderService.findById('startDate', model.parent.group);
                    var min = new Date(accessCondition.maxStartDate);
                    startDateModel.max = {
                        year: min.getFullYear(),
                        month: min.getMonth() + 1,
                        day: min.getDate()
                    };
                }
                if (accessCondition.hasEndDate) {
                    var endDateModel = this.formBuilderService.findById('endDate', model.parent.group);
                    var max = new Date(accessCondition.maxEndDate);
                    endDateModel.max = {
                        year: max.getFullYear(),
                        month: max.getMonth() + 1,
                        day: max.getDate()
                    };
                }
            }
        }
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Array)
    ], SubmissionSectionUploadFileEditComponent.prototype, "availableAccessConditionOptions", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Map)
    ], SubmissionSectionUploadFileEditComponent.prototype, "availableAccessConditionGroups", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], SubmissionSectionUploadFileEditComponent.prototype, "collectionId", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], SubmissionSectionUploadFileEditComponent.prototype, "collectionPolicyType", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", SubmissionFormsModel)
    ], SubmissionSectionUploadFileEditComponent.prototype, "configMetadataForm", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", WorkspaceitemSectionUploadFileObject)
    ], SubmissionSectionUploadFileEditComponent.prototype, "fileData", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], SubmissionSectionUploadFileEditComponent.prototype, "fileId", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], SubmissionSectionUploadFileEditComponent.prototype, "fileIndex", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], SubmissionSectionUploadFileEditComponent.prototype, "formId", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], SubmissionSectionUploadFileEditComponent.prototype, "sectionId", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], SubmissionSectionUploadFileEditComponent.prototype, "submissionId", void 0);
    tslib_1.__decorate([
        ViewChild('formRef'),
        tslib_1.__metadata("design:type", FormComponent)
    ], SubmissionSectionUploadFileEditComponent.prototype, "formRef", void 0);
    SubmissionSectionUploadFileEditComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-submission-section-upload-file-edit',
            templateUrl: './section-upload-file-edit.component.html',
        }),
        tslib_1.__metadata("design:paramtypes", [ChangeDetectorRef,
            FormBuilderService,
            FormService,
            SubmissionService])
    ], SubmissionSectionUploadFileEditComponent);
    return SubmissionSectionUploadFileEditComponent;
}());
export { SubmissionSectionUploadFileEditComponent };
//# sourceMappingURL=section-upload-file-edit.component.js.map