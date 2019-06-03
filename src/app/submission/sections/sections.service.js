import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { combineLatest } from 'rxjs';
import { distinctUntilChanged, filter, map, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { ScrollToService } from '@nicky-lenaers/ngx-scroll-to';
import { isEqual } from 'lodash';
import { hasValue, isEmpty, isNotEmpty, isNotUndefined } from '../../shared/empty.util';
import { DisableSectionAction, EnableSectionAction, InertSectionErrorsAction, RemoveSectionErrorsAction, SectionStatusChangeAction, UpdateSectionDataAction } from '../objects/submission-objects.actions';
import { submissionObjectFromIdSelector, submissionSectionDataFromIdSelector, submissionSectionErrorsFromIdSelector, submissionSectionFromIdSelector } from '../selectors';
import { SubmissionScopeType } from '../../core/submission/submission-scope-type';
import parseSectionErrorPaths from '../utils/parseSectionErrorPaths';
import { FormAddError, FormClearErrorsAction, FormRemoveErrorAction } from '../../shared/form/form.actions';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { SubmissionService } from '../submission.service';
/**
 * A service that provides methods used in submission process.
 */
var SectionsService = /** @class */ (function () {
    /**
     * Initialize service variables
     * @param {NotificationsService} notificationsService
     * @param {ScrollToService} scrollToService
     * @param {SubmissionService} submissionService
     * @param {Store<SubmissionState>} store
     * @param {TranslateService} translate
     */
    function SectionsService(notificationsService, scrollToService, submissionService, store, translate) {
        this.notificationsService = notificationsService;
        this.scrollToService = scrollToService;
        this.submissionService = submissionService;
        this.store = store;
        this.translate = translate;
    }
    /**
     * Compare the list of the current section errors with the previous one,
     * and dispatch actions to add/remove to/from the section state
     *
     * @param submissionId
     *    The submission id
     * @param sectionId
     *    The workspaceitem self url
     * @param formId
     *    The [SubmissionDefinitionsModel] that define submission configuration
     * @param currentErrors
     *    The [SubmissionSectionError] that define submission sections init data
     * @param prevErrors
     *    The [SubmissionSectionError] that define submission sections init errors
     */
    SectionsService.prototype.checkSectionErrors = function (submissionId, sectionId, formId, currentErrors, prevErrors) {
        var _this = this;
        if (prevErrors === void 0) { prevErrors = []; }
        // Remove previous error list if the current is empty
        if (isEmpty(currentErrors)) {
            this.store.dispatch(new RemoveSectionErrorsAction(submissionId, sectionId));
            this.store.dispatch(new FormClearErrorsAction(formId));
        }
        else if (!isEqual(currentErrors, prevErrors)) { // compare previous error list with the current one
            var dispatchedErrors_1 = [];
            // Itereate over the current error list
            currentErrors.forEach(function (error) {
                var errorPaths = parseSectionErrorPaths(error.path);
                errorPaths.forEach(function (path) {
                    if (path.fieldId) {
                        var fieldId = path.fieldId.replace(/\./g, '_');
                        // Dispatch action to add form error to the state;
                        var formAddErrorAction = new FormAddError(formId, fieldId, path.fieldIndex, error.message);
                        _this.store.dispatch(formAddErrorAction);
                        dispatchedErrors_1.push(fieldId);
                    }
                });
            });
            // Itereate over the previous error list
            prevErrors.forEach(function (error) {
                var errorPaths = parseSectionErrorPaths(error.path);
                errorPaths.forEach(function (path) {
                    if (path.fieldId) {
                        var fieldId = path.fieldId.replace(/\./g, '_');
                        if (!dispatchedErrors_1.includes(fieldId)) {
                            // Dispatch action to remove form error from the state;
                            var formRemoveErrorAction = new FormRemoveErrorAction(formId, fieldId, path.fieldIndex);
                            _this.store.dispatch(formRemoveErrorAction);
                        }
                    }
                });
            });
        }
    };
    /**
     * Dispatch a new [RemoveSectionErrorsAction]
     *
     * @param submissionId
     *    The submission id
     * @param sectionId
     *    The section id
     */
    SectionsService.prototype.dispatchRemoveSectionErrors = function (submissionId, sectionId) {
        this.store.dispatch(new RemoveSectionErrorsAction(submissionId, sectionId));
    };
    /**
     * Return the data object for the specified section
     *
     * @param submissionId
     *    The submission id
     * @param sectionId
     *    The section id
     * @return Observable<WorkspaceitemSectionDataType>
     *    observable of [WorkspaceitemSectionDataType]
     */
    SectionsService.prototype.getSectionData = function (submissionId, sectionId) {
        return this.store.select(submissionSectionDataFromIdSelector(submissionId, sectionId)).pipe(distinctUntilChanged());
    };
    /**
     * Return the error list object data for the specified section
     *
     * @param submissionId
     *    The submission id
     * @param sectionId
     *    The section id
     * @return Observable<SubmissionSectionError>
     *    observable of array of [SubmissionSectionError]
     */
    SectionsService.prototype.getSectionErrors = function (submissionId, sectionId) {
        return this.store.select(submissionSectionErrorsFromIdSelector(submissionId, sectionId)).pipe(distinctUntilChanged());
    };
    /**
     * Return the state object for the specified section
     *
     * @param submissionId
     *    The submission id
     * @param sectionId
     *    The section id
     * @return Observable<SubmissionSectionObject>
     *    observable of [SubmissionSectionObject]
     */
    SectionsService.prototype.getSectionState = function (submissionId, sectionId) {
        return this.store.select(submissionSectionFromIdSelector(submissionId, sectionId)).pipe(filter(function (sectionObj) { return hasValue(sectionObj); }), map(function (sectionObj) { return sectionObj; }), distinctUntilChanged());
    };
    /**
     * Check if a given section is valid
     *
     * @param submissionId
     *    The submission id
     * @param sectionId
     *    The section id
     * @return Observable<boolean>
     *    Emits true whenever a given section should be valid
     */
    SectionsService.prototype.isSectionValid = function (submissionId, sectionId) {
        return this.store.select(submissionSectionFromIdSelector(submissionId, sectionId)).pipe(filter(function (sectionObj) { return hasValue(sectionObj); }), map(function (sectionObj) { return sectionObj.isValid; }), distinctUntilChanged());
    };
    /**
     * Check if a given section is active
     *
     * @param submissionId
     *    The submission id
     * @param sectionId
     *    The section id
     * @return Observable<boolean>
     *    Emits true whenever a given section should be active
     */
    SectionsService.prototype.isSectionActive = function (submissionId, sectionId) {
        return this.submissionService.getActiveSectionId(submissionId).pipe(map(function (activeSectionId) { return sectionId === activeSectionId; }), distinctUntilChanged());
    };
    /**
     * Check if a given section is enabled
     *
     * @param submissionId
     *    The submission id
     * @param sectionId
     *    The section id
     * @return Observable<boolean>
     *    Emits true whenever a given section should be enabled
     */
    SectionsService.prototype.isSectionEnabled = function (submissionId, sectionId) {
        return this.store.select(submissionSectionFromIdSelector(submissionId, sectionId)).pipe(filter(function (sectionObj) { return hasValue(sectionObj); }), map(function (sectionObj) { return sectionObj.enabled; }), distinctUntilChanged());
    };
    /**
     * Check if a given section is a read only section
     *
     * @param submissionId
     *    The submission id
     * @param sectionId
     *    The section id
     * @param submissionScope
     *    The submission scope
     * @return Observable<boolean>
     *    Emits true whenever a given section should be read only
     */
    SectionsService.prototype.isSectionReadOnly = function (submissionId, sectionId, submissionScope) {
        return this.store.select(submissionSectionFromIdSelector(submissionId, sectionId)).pipe(filter(function (sectionObj) { return hasValue(sectionObj); }), map(function (sectionObj) {
            return isNotEmpty(sectionObj.visibility)
                && sectionObj.visibility.other === 'READONLY'
                && submissionScope !== SubmissionScopeType.WorkspaceItem;
        }), distinctUntilChanged());
    };
    /**
     * Check if a given section is a read only available
     *
     * @param submissionId
     *    The submission id
     * @param sectionId
     *    The section id
     * @return Observable<boolean>
     *    Emits true whenever a given section should be available
     */
    SectionsService.prototype.isSectionAvailable = function (submissionId, sectionId) {
        return this.store.select(submissionObjectFromIdSelector(submissionId)).pipe(filter(function (submissionState) { return isNotUndefined(submissionState); }), map(function (submissionState) {
            return isNotUndefined(submissionState.sections) && isNotUndefined(submissionState.sections[sectionId]);
        }), distinctUntilChanged());
    };
    /**
     * Dispatch a new [EnableSectionAction] to add a new section and move page target to it
     *
     * @param submissionId
     *    The submission id
     * @param sectionId
     *    The section id
     */
    SectionsService.prototype.addSection = function (submissionId, sectionId) {
        this.store.dispatch(new EnableSectionAction(submissionId, sectionId));
        var config = {
            target: sectionId,
            offset: -70
        };
        this.scrollToService.scrollTo(config);
    };
    /**
     * Dispatch a new [DisableSectionAction] to remove section
     *
     * @param submissionId
     *    The submission id
     * @param sectionId
     *    The section id
     */
    SectionsService.prototype.removeSection = function (submissionId, sectionId) {
        this.store.dispatch(new DisableSectionAction(submissionId, sectionId));
    };
    /**
     * Dispatch a new [UpdateSectionDataAction] to update section state with new data and errors
     *
     * @param submissionId
     *    The submission id
     * @param sectionId
     *    The section id
     * @param data
     *    The section data
     * @param errors
     *    The list of section errors
     */
    SectionsService.prototype.updateSectionData = function (submissionId, sectionId, data, errors) {
        var _this = this;
        if (errors === void 0) { errors = []; }
        if (isNotEmpty(data)) {
            var isAvailable$ = this.isSectionAvailable(submissionId, sectionId);
            var isEnabled$ = this.isSectionEnabled(submissionId, sectionId);
            combineLatest(isAvailable$, isEnabled$).pipe(take(1), filter(function (_a) {
                var available = _a[0], enabled = _a[1];
                return available;
            }))
                .subscribe(function (_a) {
                var available = _a[0], enabled = _a[1];
                if (!enabled) {
                    var msg = _this.translate.instant('submission.sections.general.metadata-extracted-new-section', { sectionId: sectionId });
                    _this.notificationsService.info(null, msg, null, true);
                }
                _this.store.dispatch(new UpdateSectionDataAction(submissionId, sectionId, data, errors));
            });
        }
    };
    /**
     * Dispatch a new [InertSectionErrorsAction] to update section state with new error
     *
     * @param submissionId
     *    The submission id
     * @param sectionId
     *    The section id
     * @param error
     *    The section error
     */
    SectionsService.prototype.setSectionError = function (submissionId, sectionId, error) {
        this.store.dispatch(new InertSectionErrorsAction(submissionId, sectionId, error));
    };
    /**
     * Dispatch a new [SectionStatusChangeAction] to update section state with new status
     *
     * @param submissionId
     *    The submission id
     * @param sectionId
     *    The section id
     * @param status
     *    The section status
     */
    SectionsService.prototype.setSectionStatus = function (submissionId, sectionId, status) {
        this.store.dispatch(new SectionStatusChangeAction(submissionId, sectionId, status));
    };
    SectionsService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [NotificationsService,
            ScrollToService,
            SubmissionService,
            Store,
            TranslateService])
    ], SectionsService);
    return SectionsService;
}());
export { SectionsService };
//# sourceMappingURL=sections.service.js.map