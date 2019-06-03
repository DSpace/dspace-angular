import * as tslib_1 from "tslib";
import { Inject, Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { of as observableOf, timer as observableTimer } from 'rxjs';
import { catchError, distinctUntilChanged, filter, find, first, map, startWith } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { submissionSelector } from './submission.reducers';
import { hasValue, isEmpty, isNotUndefined } from '../shared/empty.util';
import { CancelSubmissionFormAction, ChangeSubmissionCollectionAction, DiscardSubmissionAction, InitSubmissionFormAction, ResetSubmissionFormAction, SaveAndDepositSubmissionAction, SaveForLaterSubmissionFormAction, SaveSubmissionFormAction, SaveSubmissionSectionFormAction, SetActiveSectionAction } from './objects/submission-objects.actions';
import { submissionObjectFromIdSelector } from './selectors';
import { GLOBAL_CONFIG } from '../../config';
import { SubmissionRestService } from '../core/submission/submission-rest.service';
import { SubmissionScopeType } from '../core/submission/submission-scope-type';
import { RouteService } from '../shared/services/route.service';
import { NotificationsService } from '../shared/notifications/notifications.service';
import { RemoteData } from '../core/data/remote-data';
import { RemoteDataError } from '../core/data/remote-data-error';
/**
 * A service that provides methods used in submission process.
 */
var SubmissionService = /** @class */ (function () {
    /**
     * Initialize service variables
     * @param {GlobalConfig} EnvConfig
     * @param {NotificationsService} notificationsService
     * @param {SubmissionRestService} restService
     * @param {Router} router
     * @param {RouteService} routeService
     * @param {Store<SubmissionState>} store
     * @param {TranslateService} translate
     */
    function SubmissionService(EnvConfig, notificationsService, restService, router, routeService, store, translate) {
        this.EnvConfig = EnvConfig;
        this.notificationsService = notificationsService;
        this.restService = restService;
        this.router = router;
        this.routeService = routeService;
        this.store = store;
        this.translate = translate;
    }
    /**
     * Dispatch a new [ChangeSubmissionCollectionAction]
     *
     * @param submissionId
     *    The submission id
     * @param collectionId
     *    The collection id
     */
    SubmissionService.prototype.changeSubmissionCollection = function (submissionId, collectionId) {
        this.store.dispatch(new ChangeSubmissionCollectionAction(submissionId, collectionId));
    };
    /**
     * Perform a REST call to create a new workspaceitem and return response
     *
     * @return Observable<SubmissionObject>
     *    observable of SubmissionObject
     */
    SubmissionService.prototype.createSubmission = function () {
        return this.restService.postToEndpoint('workspaceitems', {}).pipe(map(function (workspaceitem) { return workspaceitem[0]; }), catchError(function () { return observableOf({}); }));
    };
    /**
     * Perform a REST call to deposit a workspaceitem and return response
     *
     * @param selfUrl
     *    The workspaceitem self url
     * @return Observable<SubmissionObject>
     *    observable of SubmissionObject
     */
    SubmissionService.prototype.depositSubmission = function (selfUrl) {
        var options = Object.create({});
        var headers = new HttpHeaders();
        headers = headers.append('Content-Type', 'text/uri-list');
        options.headers = headers;
        return this.restService.postToEndpoint('workflowitems', selfUrl, null, options);
    };
    /**
     * Perform a REST call to delete a workspaceitem and return response
     *
     * @param submissionId
     *    The submission id
     * @return Observable<SubmissionObject>
     *    observable of SubmissionObject
     */
    SubmissionService.prototype.discardSubmission = function (submissionId) {
        return this.restService.deleteById(submissionId);
    };
    /**
     * Dispatch a new [InitSubmissionFormAction]
     *
     * @param collectionId
     *    The collection id
     * @param submissionId
     *    The submission id
     * @param selfUrl
     *    The workspaceitem self url
     * @param submissionDefinition
     *    The [SubmissionDefinitionsModel] that define submission configuration
     * @param sections
     *    The [WorkspaceitemSectionsObject] that define submission sections init data
     * @param errors
     *    The [SubmissionSectionError] that define submission sections init errors
     */
    SubmissionService.prototype.dispatchInit = function (collectionId, submissionId, selfUrl, submissionDefinition, sections, errors) {
        this.store.dispatch(new InitSubmissionFormAction(collectionId, submissionId, selfUrl, submissionDefinition, sections, errors));
    };
    /**
     * Dispatch a new [SaveAndDepositSubmissionAction]
     *
     * @param submissionId
     *    The submission id
     */
    SubmissionService.prototype.dispatchDeposit = function (submissionId) {
        this.store.dispatch(new SaveAndDepositSubmissionAction(submissionId));
    };
    /**
     * Dispatch a new [DiscardSubmissionAction]
     *
     * @param submissionId
     *    The submission id
     */
    SubmissionService.prototype.dispatchDiscard = function (submissionId) {
        this.store.dispatch(new DiscardSubmissionAction(submissionId));
    };
    /**
     * Dispatch a new [SaveSubmissionFormAction]
     *
     * @param submissionId
     *    The submission id
     */
    SubmissionService.prototype.dispatchSave = function (submissionId) {
        this.store.dispatch(new SaveSubmissionFormAction(submissionId));
    };
    /**
     * Dispatch a new [SaveForLaterSubmissionFormAction]
     *
     * @param submissionId
     *    The submission id
     */
    SubmissionService.prototype.dispatchSaveForLater = function (submissionId) {
        this.store.dispatch(new SaveForLaterSubmissionFormAction(submissionId));
    };
    /**
     * Dispatch a new [SaveSubmissionSectionFormAction]
     *
     * @param submissionId
     *    The submission id
     * @param sectionId
     *    The section id
     */
    SubmissionService.prototype.dispatchSaveSection = function (submissionId, sectionId) {
        this.store.dispatch(new SaveSubmissionSectionFormAction(submissionId, sectionId));
    };
    /**
     * Return the id of the current focused section for the specified submission
     *
     * @param submissionId
     *    The submission id
     * @return Observable<string>
     *    observable of section id
     */
    SubmissionService.prototype.getActiveSectionId = function (submissionId) {
        return this.getSubmissionObject(submissionId).pipe(map(function (submission) { return submission.activeSection; }));
    };
    /**
     * Return the [SubmissionObjectEntry] for the specified submission
     *
     * @param submissionId
     *    The submission id
     * @return Observable<SubmissionObjectEntry>
     *    observable of SubmissionObjectEntry
     */
    SubmissionService.prototype.getSubmissionObject = function (submissionId) {
        return this.store.select(submissionObjectFromIdSelector(submissionId)).pipe(filter(function (submission) { return isNotUndefined(submission); }));
    };
    /**
     * Return a list of the active [SectionDataObject] belonging to the specified submission
     *
     * @param submissionId
     *    The submission id
     * @return Observable<SubmissionObjectEntry>
     *    observable with the list of active submission's sections
     */
    SubmissionService.prototype.getSubmissionSections = function (submissionId) {
        var _this = this;
        return this.getSubmissionObject(submissionId).pipe(find(function (submission) { return isNotUndefined(submission.sections) && !submission.isLoading; }), map(function (submission) { return submission.sections; }), map(function (sections) {
            var availableSections = [];
            Object.keys(sections)
                .filter(function (sectionId) { return !_this.isSectionHidden(sections[sectionId]); })
                .forEach(function (sectionId) {
                var sectionObject = Object.create({});
                sectionObject.config = sections[sectionId].config;
                sectionObject.mandatory = sections[sectionId].mandatory;
                sectionObject.data = sections[sectionId].data;
                sectionObject.errors = sections[sectionId].errors;
                sectionObject.header = sections[sectionId].header;
                sectionObject.id = sectionId;
                sectionObject.sectionType = sections[sectionId].sectionType;
                availableSections.push(sectionObject);
            });
            return availableSections;
        }), startWith([]), distinctUntilChanged());
    };
    /**
     * Return a list of the disabled [SectionDataObject] belonging to the specified submission
     *
     * @param submissionId
     *    The submission id
     * @return Observable<SubmissionObjectEntry>
     *    observable with the list of disabled submission's sections
     */
    SubmissionService.prototype.getDisabledSectionsList = function (submissionId) {
        var _this = this;
        return this.getSubmissionObject(submissionId).pipe(filter(function (submission) { return isNotUndefined(submission.sections) && !submission.isLoading; }), map(function (submission) { return submission.sections; }), map(function (sections) {
            var disabledSections = [];
            Object.keys(sections)
                .filter(function (sectionId) { return !_this.isSectionHidden(sections[sectionId]); })
                .filter(function (sectionId) { return !sections[sectionId].enabled; })
                .forEach(function (sectionId) {
                var sectionObject = Object.create({});
                sectionObject.header = sections[sectionId].header;
                sectionObject.id = sectionId;
                disabledSections.push(sectionObject);
            });
            return disabledSections;
        }), startWith([]), distinctUntilChanged());
    };
    /**
     * Return the correct REST endpoint link path depending on the page route
     *
     * @return string
     *    link path
     */
    SubmissionService.prototype.getSubmissionObjectLinkName = function () {
        var url = this.router.routerState.snapshot.url;
        if (url.startsWith('/workspaceitems') || url.startsWith('/submit')) {
            return 'workspaceitems';
        }
        else if (url.startsWith('/workflowitems')) {
            return 'workflowitems';
        }
        else {
            return 'edititems';
        }
    };
    /**
     * Return the submission scope
     *
     * @return SubmissionScopeType
     *    the SubmissionScopeType
     */
    SubmissionService.prototype.getSubmissionScope = function () {
        var scope;
        switch (this.getSubmissionObjectLinkName()) {
            case 'workspaceitems':
                scope = SubmissionScopeType.WorkspaceItem;
                break;
            case 'workflowitems':
                scope = SubmissionScopeType.WorkflowItem;
                break;
        }
        return scope;
    };
    /**
     * Return the validity status of the submission
     *
     * @param submissionId
     *    The submission id
     * @return Observable<boolean>
     *    observable with submission validity status
     */
    SubmissionService.prototype.getSubmissionStatus = function (submissionId) {
        var _this = this;
        return this.store.select(submissionSelector).pipe(map(function (submissions) { return submissions.objects[submissionId]; }), filter(function (item) { return isNotUndefined(item) && isNotUndefined(item.sections); }), map(function (item) { return item.sections; }), map(function (sections) {
            var states = [];
            if (isNotUndefined(sections)) {
                Object.keys(sections)
                    .filter(function (sectionId) { return sections.hasOwnProperty(sectionId); })
                    .filter(function (sectionId) { return !_this.isSectionHidden(sections[sectionId]); })
                    .filter(function (sectionId) { return sections[sectionId].enabled; })
                    .filter(function (sectionId) { return sections[sectionId].isValid === false; })
                    .forEach(function (sectionId) {
                    states.push(sections[sectionId].isValid);
                });
            }
            return !isEmpty(sections) && isEmpty(states);
        }), distinctUntilChanged(), startWith(false));
    };
    /**
     * Return the save processing status of the submission
     *
     * @param submissionId
     *    The submission id
     * @return Observable<boolean>
     *    observable with submission save processing status
     */
    SubmissionService.prototype.getSubmissionSaveProcessingStatus = function (submissionId) {
        return this.getSubmissionObject(submissionId).pipe(map(function (state) { return state.savePending; }), distinctUntilChanged(), startWith(false));
    };
    /**
     * Return the deposit processing status of the submission
     *
     * @param submissionId
     *    The submission id
     * @return Observable<boolean>
     *    observable with submission deposit processing status
     */
    SubmissionService.prototype.getSubmissionDepositProcessingStatus = function (submissionId) {
        return this.getSubmissionObject(submissionId).pipe(map(function (state) { return state.depositPending; }), distinctUntilChanged(), startWith(false));
    };
    /**
     * Return the visibility status of the specified section
     *
     * @param sectionData
     *    The section data
     * @return boolean
     *    true if section is hidden, false otherwise
     */
    SubmissionService.prototype.isSectionHidden = function (sectionData) {
        return (isNotUndefined(sectionData.visibility)
            && sectionData.visibility.main === 'HIDDEN'
            && sectionData.visibility.other === 'HIDDEN');
    };
    /**
     * Return the loading status of the submission
     *
     * @param submissionId
     *    The submission id
     * @return Observable<boolean>
     *    observable with submission loading status
     */
    SubmissionService.prototype.isSubmissionLoading = function (submissionId) {
        return this.getSubmissionObject(submissionId).pipe(map(function (submission) { return submission.isLoading; }), distinctUntilChanged());
    };
    /**
     * Show a notification when a new section is added to submission form
     *
     * @param submissionId
     *    The submission id
     * @param sectionId
     *    The section id
     * @param sectionType
     *    The section type
     */
    SubmissionService.prototype.notifyNewSection = function (submissionId, sectionId, sectionType) {
        var m = this.translate.instant('submission.sections.general.metadata-extracted-new-section', { sectionId: sectionId });
        this.notificationsService.info(null, m, null, true);
    };
    /**
     * Redirect to MyDspace page
     */
    SubmissionService.prototype.redirectToMyDSpace = function () {
        var _this = this;
        this.routeService.getPreviousUrl().pipe(first()).subscribe(function (previousUrl) {
            if (isEmpty(previousUrl) || !previousUrl.startsWith('/mydspace')) {
                _this.router.navigate(['/mydspace']);
            }
            else {
                _this.router.navigateByUrl(previousUrl);
            }
        });
    };
    /**
     * Dispatch a new [CancelSubmissionFormAction]
     */
    SubmissionService.prototype.resetAllSubmissionObjects = function () {
        this.store.dispatch(new CancelSubmissionFormAction());
    };
    /**
     * Dispatch a new [ResetSubmissionFormAction]
     *
     * @param collectionId
     *    The collection id
     * @param submissionId
     *    The submission id
     * @param selfUrl
     *    The workspaceitem self url
     * @param submissionDefinition
     *    The [SubmissionDefinitionsModel] that define submission configuration
     * @param sections
     *    The [WorkspaceitemSectionsObject] that define submission sections init data
     */
    SubmissionService.prototype.resetSubmissionObject = function (collectionId, submissionId, selfUrl, submissionDefinition, sections) {
        this.store.dispatch(new ResetSubmissionFormAction(collectionId, submissionId, selfUrl, sections, submissionDefinition));
    };
    /**
     * Perform a REST call to retrieve an existing workspaceitem/workflowitem and return response
     *
     * @return Observable<RemoteData<SubmissionObject>>
     *    observable of RemoteData<SubmissionObject>
     */
    SubmissionService.prototype.retrieveSubmission = function (submissionId) {
        return this.restService.getDataById(this.getSubmissionObjectLinkName(), submissionId).pipe(find(function (submissionObjects) { return isNotUndefined(submissionObjects); }), map(function (submissionObjects) { return new RemoteData(false, false, true, null, submissionObjects[0]); }), catchError(function (errorResponse) {
            return observableOf(new RemoteData(false, false, false, new RemoteDataError(errorResponse.statusCode, errorResponse.statusText, errorResponse.errorMessage), null));
        }));
    };
    /**
     * Dispatch a new [SetActiveSectionAction]
     *
     * @param submissionId
     *    The submission id
     * @param sectionId
     *    The section id
     */
    SubmissionService.prototype.setActiveSection = function (submissionId, sectionId) {
        this.store.dispatch(new SetActiveSectionAction(submissionId, sectionId));
    };
    /**
     * Allow to save automatically the submission
     *
     * @param submissionId
     *    The submission id
     */
    SubmissionService.prototype.startAutoSave = function (submissionId) {
        var _this = this;
        this.stopAutoSave();
        // AUTOSAVE submission
        // Retrieve interval from config and convert to milliseconds
        var duration = this.EnvConfig.submission.autosave.timer * (1000 * 60);
        // Dispatch save action after given duration
        this.timer$ = observableTimer(duration, duration);
        this.autoSaveSub = this.timer$
            .subscribe(function () { return _this.store.dispatch(new SaveSubmissionFormAction(submissionId)); });
    };
    /**
     * Unsubscribe subscription to timer
     */
    SubmissionService.prototype.stopAutoSave = function () {
        if (hasValue(this.autoSaveSub)) {
            this.autoSaveSub.unsubscribe();
            this.autoSaveSub = null;
        }
    };
    SubmissionService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__param(0, Inject(GLOBAL_CONFIG)),
        tslib_1.__metadata("design:paramtypes", [Object, NotificationsService,
            SubmissionRestService,
            Router,
            RouteService,
            Store,
            TranslateService])
    ], SubmissionService);
    return SubmissionService;
}());
export { SubmissionService };
//# sourceMappingURL=submission.service.js.map