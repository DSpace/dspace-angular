import * as tslib_1 from "tslib";
import { ChangeDetectorRef, Component, Inject, ViewChild } from '@angular/core';
import { distinctUntilChanged, filter, find, flatMap, map, take, tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { isEqual } from 'lodash';
import { FormBuilderService } from '../../../shared/form/builder/form-builder.service';
import { FormComponent } from '../../../shared/form/form.component';
import { FormService } from '../../../shared/form/form.service';
import { SectionModelComponent } from '../models/section.model';
import { SubmissionFormsConfigService } from '../../../core/config/submission-forms-config.service';
import { hasValue, isNotEmpty, isUndefined } from '../../../shared/empty.util';
import { JsonPatchOperationPathCombiner } from '../../../core/json-patch/builder/json-patch-operation-path-combiner';
import { FormFieldPreviousValueObject } from '../../../shared/form/builder/models/form-field-previous-value-object';
import { GLOBAL_CONFIG } from '../../../../config';
import { renderSectionFor } from '../sections-decorator';
import { SectionsType } from '../sections-type';
import { SubmissionService } from '../../submission.service';
import { SectionFormOperationsService } from './section-form-operations.service';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { SectionsService } from '../sections.service';
import { difference } from '../../../shared/object.util';
/**
 * This component represents a section that contains a Form.
 */
var SubmissionSectionformComponent = /** @class */ (function (_super) {
    tslib_1.__extends(SubmissionSectionformComponent, _super);
    /**
     * Initialize instance variables
     *
     * @param {ChangeDetectorRef} cdr
     * @param {FormBuilderService} formBuilderService
     * @param {SectionFormOperationsService} formOperationsService
     * @param {FormService} formService
     * @param {SubmissionFormsConfigService} formConfigService
     * @param {NotificationsService} notificationsService
     * @param {SectionsService} sectionService
     * @param {SubmissionService} submissionService
     * @param {TranslateService} translate
     * @param {GlobalConfig} EnvConfig
     * @param {string} injectedCollectionId
     * @param {SectionDataObject} injectedSectionData
     * @param {string} injectedSubmissionId
     */
    function SubmissionSectionformComponent(cdr, formBuilderService, formOperationsService, formService, formConfigService, notificationsService, sectionService, submissionService, translate, EnvConfig, injectedCollectionId, injectedSectionData, injectedSubmissionId) {
        var _this = _super.call(this, injectedCollectionId, injectedSectionData, injectedSubmissionId) || this;
        _this.cdr = cdr;
        _this.formBuilderService = formBuilderService;
        _this.formOperationsService = formOperationsService;
        _this.formService = formService;
        _this.formConfigService = formConfigService;
        _this.notificationsService = notificationsService;
        _this.sectionService = sectionService;
        _this.submissionService = submissionService;
        _this.translate = translate;
        _this.EnvConfig = EnvConfig;
        _this.injectedCollectionId = injectedCollectionId;
        _this.injectedSectionData = injectedSectionData;
        _this.injectedSubmissionId = injectedSubmissionId;
        /**
         * A boolean representing if this section is updating
         * @type {boolean}
         */
        _this.isUpdating = false;
        /**
         * A boolean representing if this section is loading
         * @type {boolean}
         */
        _this.isLoading = true;
        /**
         * The form data
         * @type {any}
         */
        _this.formData = Object.create({});
        /**
         * The [FormFieldPreviousValueObject] object
         * @type {FormFieldPreviousValueObject}
         */
        _this.previousValue = new FormFieldPreviousValueObject();
        /**
         * The list of Subscription
         * @type {Array}
         */
        _this.subs = [];
        return _this;
    }
    /**
     * Initialize all instance variables and retrieve form configuration
     */
    SubmissionSectionformComponent.prototype.onSectionInit = function () {
        var _this = this;
        this.pathCombiner = new JsonPatchOperationPathCombiner('sections', this.sectionData.id);
        this.formId = this.formService.getUniqueId(this.sectionData.id);
        this.formConfigService.getConfigByHref(this.sectionData.config).pipe(map(function (configData) { return configData.payload; }), tap(function (config) { return _this.formConfig = config; }), flatMap(function () { return _this.sectionService.getSectionData(_this.submissionId, _this.sectionData.id); }), take(1))
            .subscribe(function (sectionData) {
            if (isUndefined(_this.formModel)) {
                _this.sectionData.errors = [];
                // Is the first loading so init form
                _this.initForm(sectionData);
                _this.sectionData.data = sectionData;
                _this.subscriptions();
                _this.isLoading = false;
                _this.cdr.detectChanges();
            }
        });
    };
    /**
     * Unsubscribe from all subscriptions
     */
    SubmissionSectionformComponent.prototype.onSectionDestroy = function () {
        this.subs
            .filter(function (subscription) { return hasValue(subscription); })
            .forEach(function (subscription) { return subscription.unsubscribe(); });
    };
    /**
     * Get section status
     *
     * @return Observable<boolean>
     *     the section status
     */
    SubmissionSectionformComponent.prototype.getSectionStatus = function () {
        return this.formService.isValid(this.formId);
    };
    /**
     * Check if the section data has been enriched by the server
     *
     * @param sectionData
     *    the section data retrieved from the server
     */
    SubmissionSectionformComponent.prototype.hasMetadataEnrichment = function (sectionData) {
        var diffResult = [];
        // compare current form data state with section data retrieved from store
        var diffObj = difference(sectionData, this.formData);
        // iterate over differences to check whether they are actually different
        Object.keys(diffObj)
            .forEach(function (key) {
            diffObj[key].forEach(function (value) {
                if (value.hasOwnProperty('value')) {
                    diffResult.push(value);
                }
            });
        });
        return isNotEmpty(diffResult);
    };
    /**
     * Initialize form model
     *
     * @param sectionData
     *    the section data retrieved from the server
     */
    SubmissionSectionformComponent.prototype.initForm = function (sectionData) {
        try {
            this.formModel = this.formBuilderService.modelFromConfiguration(this.formConfig, this.collectionId, sectionData, this.submissionService.getSubmissionScope());
        }
        catch (e) {
            var msg = this.translate.instant('error.submission.sections.init-form-error') + e.toString();
            var sectionError = {
                message: msg,
                path: '/sections/' + this.sectionData.id
            };
            this.sectionService.setSectionError(this.submissionId, this.sectionData.id, sectionError);
        }
    };
    /**
     * Update form model
     *
     * @param sectionData
     *    the section data retrieved from the server
     * @param errors
     *    the section errors retrieved from the server
     */
    SubmissionSectionformComponent.prototype.updateForm = function (sectionData, errors) {
        if (isNotEmpty(sectionData) && !isEqual(sectionData, this.sectionData.data)) {
            this.sectionData.data = sectionData;
            if (this.hasMetadataEnrichment(sectionData)) {
                var msg = this.translate.instant('submission.sections.general.metadata-extracted', { sectionId: this.sectionData.id });
                this.notificationsService.info(null, msg, null, true);
                this.isUpdating = true;
                this.formModel = null;
                this.cdr.detectChanges();
                this.initForm(sectionData);
                this.checksForErrors(errors);
                this.isUpdating = false;
                this.cdr.detectChanges();
            }
            else if (isNotEmpty(errors) || isNotEmpty(this.sectionData.errors)) {
                this.checksForErrors(errors);
            }
        }
        else if (isNotEmpty(errors) || isNotEmpty(this.sectionData.errors)) {
            this.checksForErrors(errors);
        }
    };
    /**
     * Check if there are form validation error retrieved from server
     *
     * @param errors
     *    the section errors retrieved from the server
     */
    SubmissionSectionformComponent.prototype.checksForErrors = function (errors) {
        var _this = this;
        this.formService.isFormInitialized(this.formId).pipe(find(function (status) { return status === true && !_this.isUpdating; }))
            .subscribe(function () {
            _this.sectionService.checkSectionErrors(_this.submissionId, _this.sectionData.id, _this.formId, errors, _this.sectionData.errors);
            _this.sectionData.errors = errors;
            _this.cdr.detectChanges();
        });
    };
    /**
     * Initialize all subscriptions
     */
    SubmissionSectionformComponent.prototype.subscriptions = function () {
        var _this = this;
        this.subs.push(
        /**
         * Subscribe to form's data
         */
        this.formService.getFormData(this.formId).pipe(distinctUntilChanged())
            .subscribe(function (formData) {
            _this.formData = formData;
        }), 
        /**
         * Subscribe to section state
         */
        this.sectionService.getSectionState(this.submissionId, this.sectionData.id).pipe(filter(function (sectionState) {
            return isNotEmpty(sectionState) && (isNotEmpty(sectionState.data) || isNotEmpty(sectionState.errors));
        }), distinctUntilChanged())
            .subscribe(function (sectionState) {
            _this.updateForm(sectionState.data, sectionState.errors);
        }));
    };
    /**
     * Method called when a form dfChange event is fired.
     * Dispatch form operations based on changes.
     *
     * @param event
     *    the [[DynamicFormControlEvent]] emitted
     */
    SubmissionSectionformComponent.prototype.onChange = function (event) {
        this.formOperationsService.dispatchOperationsFromEvent(this.pathCombiner, event, this.previousValue, this.hasStoredValue(this.formBuilderService.getId(event.model), this.formOperationsService.getArrayIndexFromEvent(event)));
        var metadata = this.formOperationsService.getFieldPathSegmentedFromChangeEvent(event);
        var value = this.formOperationsService.getFieldValueFromChangeEvent(event);
        if (this.EnvConfig.submission.autosave.metadata.indexOf(metadata) !== -1 && isNotEmpty(value)) {
            this.submissionService.dispatchSave(this.submissionId);
        }
    };
    /**
     * Method called when a form dfFocus event is fired.
     * Initialize [FormFieldPreviousValueObject] instance.
     *
     * @param event
     *    the [[DynamicFormControlEvent]] emitted
     */
    SubmissionSectionformComponent.prototype.onFocus = function (event) {
        var value = this.formOperationsService.getFieldValueFromChangeEvent(event);
        var path = this.formBuilderService.getPath(event.model);
        if (this.formBuilderService.hasMappedGroupValue(event.model)) {
            this.previousValue.path = path;
            this.previousValue.value = this.formOperationsService.getQualdropValueMap(event);
        }
        else if (isNotEmpty(value) && ((typeof value === 'object' && isNotEmpty(value.value)) || (typeof value === 'string'))) {
            this.previousValue.path = path;
            this.previousValue.value = value;
        }
    };
    /**
     * Method called when a form remove event is fired.
     * Dispatch form operations based on changes.
     *
     * @param event
     *    the [[DynamicFormControlEvent]] emitted
     */
    SubmissionSectionformComponent.prototype.onRemove = function (event) {
        this.formOperationsService.dispatchOperationsFromEvent(this.pathCombiner, event, this.previousValue, this.hasStoredValue(this.formBuilderService.getId(event.model), this.formOperationsService.getArrayIndexFromEvent(event)));
    };
    /**
     * Check if the specified form field has already a value stored
     *
     * @param fieldId
     *    the section data retrieved from the serverù
     * @param index
     *    the section data retrieved from the server
     */
    SubmissionSectionformComponent.prototype.hasStoredValue = function (fieldId, index) {
        if (isNotEmpty(this.sectionData.data)) {
            return this.sectionData.data.hasOwnProperty(fieldId) && isNotEmpty(this.sectionData.data[fieldId][index]);
        }
        else {
            return false;
        }
    };
    tslib_1.__decorate([
        ViewChild('formRef'),
        tslib_1.__metadata("design:type", FormComponent)
    ], SubmissionSectionformComponent.prototype, "formRef", void 0);
    SubmissionSectionformComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-submission-section-form',
            styleUrls: ['./section-form.component.scss'],
            templateUrl: './section-form.component.html',
        }),
        renderSectionFor(SectionsType.SubmissionForm),
        tslib_1.__param(9, Inject(GLOBAL_CONFIG)),
        tslib_1.__param(10, Inject('collectionIdProvider')),
        tslib_1.__param(11, Inject('sectionDataProvider')),
        tslib_1.__param(12, Inject('submissionIdProvider')),
        tslib_1.__metadata("design:paramtypes", [ChangeDetectorRef,
            FormBuilderService,
            SectionFormOperationsService,
            FormService,
            SubmissionFormsConfigService,
            NotificationsService,
            SectionsService,
            SubmissionService,
            TranslateService, Object, String, Object, String])
    ], SubmissionSectionformComponent);
    return SubmissionSectionformComponent;
}(SectionModelComponent));
export { SubmissionSectionformComponent };
//# sourceMappingURL=section-form.component.js.map