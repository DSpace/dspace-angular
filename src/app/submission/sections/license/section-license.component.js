import * as tslib_1 from "tslib";
import { ChangeDetectorRef, Component, Inject, ViewChild } from '@angular/core';
import { distinctUntilChanged, filter, find, flatMap, map, startWith, take } from 'rxjs/operators';
import { SectionModelComponent } from '../models/section.model';
import { JsonPatchOperationsBuilder } from '../../../core/json-patch/builder/json-patch-operations-builder';
import { CollectionDataService } from '../../../core/data/collection-data.service';
import { hasValue, isNotEmpty, isNotNull, isNotUndefined } from '../../../shared/empty.util';
import { SECTION_LICENSE_FORM_LAYOUT, SECTION_LICENSE_FORM_MODEL } from './section-license.model';
import { FormBuilderService } from '../../../shared/form/builder/form-builder.service';
import { FormService } from '../../../shared/form/form.service';
import { JsonPatchOperationPathCombiner } from '../../../core/json-patch/builder/json-patch-operation-path-combiner';
import { SectionsType } from '../sections-type';
import { renderSectionFor } from '../sections-decorator';
import { SubmissionService } from '../../submission.service';
import { SectionsService } from '../sections.service';
import { SectionFormOperationsService } from '../form/section-form-operations.service';
import { FormComponent } from '../../../shared/form/form.component';
/**
 * This component represents a section that contains the submission license form.
 */
var SubmissionSectionLicenseComponent = /** @class */ (function (_super) {
    tslib_1.__extends(SubmissionSectionLicenseComponent, _super);
    /**
     * Initialize instance variables
     *
     * @param {ChangeDetectorRef} changeDetectorRef
     * @param {CollectionDataService} collectionDataService
     * @param {FormBuilderService} formBuilderService
     * @param {SectionFormOperationsService} formOperationsService
     * @param {FormService} formService
     * @param {JsonPatchOperationsBuilder} operationsBuilder
     * @param {SectionsService} sectionService
     * @param {SubmissionService} submissionService
     * @param {string} injectedCollectionId
     * @param {SectionDataObject} injectedSectionData
     * @param {string} injectedSubmissionId
     */
    function SubmissionSectionLicenseComponent(changeDetectorRef, collectionDataService, formBuilderService, formOperationsService, formService, operationsBuilder, sectionService, submissionService, injectedCollectionId, injectedSectionData, injectedSubmissionId) {
        var _this = _super.call(this, injectedCollectionId, injectedSectionData, injectedSubmissionId) || this;
        _this.changeDetectorRef = changeDetectorRef;
        _this.collectionDataService = collectionDataService;
        _this.formBuilderService = formBuilderService;
        _this.formOperationsService = formOperationsService;
        _this.formService = formService;
        _this.operationsBuilder = operationsBuilder;
        _this.sectionService = sectionService;
        _this.submissionService = submissionService;
        _this.injectedCollectionId = injectedCollectionId;
        _this.injectedSectionData = injectedSectionData;
        _this.injectedSubmissionId = injectedSubmissionId;
        /**
         * The [[DynamicFormLayout]] object
         * @type {DynamicFormLayout}
         */
        _this.formLayout = SECTION_LICENSE_FORM_LAYOUT;
        /**
         * A boolean representing if to show form submit and cancel buttons
         * @type {boolean}
         */
        _this.displaySubmit = false;
        /**
         * Array to track all subscriptions and unsubscribe them onDestroy
         * @type {Array}
         */
        _this.subs = [];
        return _this;
    }
    /**
     * Initialize all instance variables and retrieve submission license
     */
    SubmissionSectionLicenseComponent.prototype.onSectionInit = function () {
        var _this = this;
        this.pathCombiner = new JsonPatchOperationPathCombiner('sections', this.sectionData.id);
        this.formId = this.formService.getUniqueId(this.sectionData.id);
        this.formModel = this.formBuilderService.fromJSON(SECTION_LICENSE_FORM_MODEL);
        var model = this.formBuilderService.findById('granted', this.formModel);
        // Retrieve license accepted status
        if (this.sectionData.data.granted) {
            model.valueUpdates.next(true);
        }
        else {
            model.valueUpdates.next(false);
        }
        this.licenseText$ = this.collectionDataService.findById(this.collectionId).pipe(filter(function (collectionData) { return isNotUndefined((collectionData.payload)); }), flatMap(function (collectionData) { return collectionData.payload.license; }), find(function (licenseData) { return isNotUndefined((licenseData.payload)); }), map(function (licenseData) { return licenseData.payload.text; }), startWith(''));
        this.subs.push(
        // Disable checkbox whether it's in workflow or item scope
        this.sectionService.isSectionReadOnly(this.submissionId, this.sectionData.id, this.submissionService.getSubmissionScope()).pipe(take(1), filter(function (isReadOnly) { return isReadOnly; }))
            .subscribe(function () {
            model.disabledUpdates.next(true);
        }), this.sectionService.getSectionErrors(this.submissionId, this.sectionData.id).pipe(filter(function (errors) { return isNotEmpty(errors); }), distinctUntilChanged())
            .subscribe(function (errors) {
            // parse errors
            var newErrors = errors.map(function (error) {
                // When the error path is only on the section,
                // replace it with the path to the form field to display error also on the form
                if (error.path === '/sections/license') {
                    // check whether license is not accepted
                    if (!model.checked) {
                        return Object.assign({}, error, { path: '/sections/license/granted' });
                    }
                    else {
                        return null;
                    }
                }
                else {
                    return error;
                }
            }).filter(function (error) { return isNotNull(error); });
            if (isNotEmpty(newErrors)) {
                _this.sectionService.checkSectionErrors(_this.submissionId, _this.sectionData.id, _this.formId, newErrors);
                _this.sectionData.errors = errors;
            }
            else {
                // Remove any section's errors
                _this.sectionService.dispatchRemoveSectionErrors(_this.submissionId, _this.sectionData.id);
            }
            _this.changeDetectorRef.detectChanges();
        }));
    };
    /**
     * Get section status
     *
     * @return Observable<boolean>
     *     the section status
     */
    SubmissionSectionLicenseComponent.prototype.getSectionStatus = function () {
        var model = this.formBuilderService.findById('granted', this.formModel);
        return model.valueUpdates.pipe(map(function (value) { return value === true; }), startWith(model.value));
    };
    /**
     * Method called when a form dfChange event is fired.
     * Dispatch form operations based on changes.
     */
    SubmissionSectionLicenseComponent.prototype.onChange = function (event) {
        var path = this.formOperationsService.getFieldPathSegmentedFromChangeEvent(event);
        var value = this.formOperationsService.getFieldValueFromChangeEvent(event);
        if (value) {
            this.operationsBuilder.add(this.pathCombiner.getPath(path), value.value.toString(), false, true);
            // Remove any section's errors
            this.sectionService.dispatchRemoveSectionErrors(this.submissionId, this.sectionData.id);
        }
        else {
            this.operationsBuilder.remove(this.pathCombiner.getPath(path));
        }
    };
    /**
     * Unsubscribe from all subscriptions
     */
    SubmissionSectionLicenseComponent.prototype.onSectionDestroy = function () {
        this.subs
            .filter(function (subscription) { return hasValue(subscription); })
            .forEach(function (subscription) { return subscription.unsubscribe(); });
    };
    tslib_1.__decorate([
        ViewChild('formRef'),
        tslib_1.__metadata("design:type", FormComponent)
    ], SubmissionSectionLicenseComponent.prototype, "formRef", void 0);
    SubmissionSectionLicenseComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-submission-section-license',
            styleUrls: ['./section-license.component.scss'],
            templateUrl: './section-license.component.html',
        }),
        renderSectionFor(SectionsType.License),
        tslib_1.__param(8, Inject('collectionIdProvider')),
        tslib_1.__param(9, Inject('sectionDataProvider')),
        tslib_1.__param(10, Inject('submissionIdProvider')),
        tslib_1.__metadata("design:paramtypes", [ChangeDetectorRef,
            CollectionDataService,
            FormBuilderService,
            SectionFormOperationsService,
            FormService,
            JsonPatchOperationsBuilder,
            SectionsService,
            SubmissionService, String, Object, String])
    ], SubmissionSectionLicenseComponent);
    return SubmissionSectionLicenseComponent;
}(SectionModelComponent));
export { SubmissionSectionLicenseComponent };
//# sourceMappingURL=section-license.component.js.map