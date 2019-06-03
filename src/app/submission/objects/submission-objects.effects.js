import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { from as observableFrom, of as observableOf } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { union } from 'lodash';
import { CompleteInitSubmissionFormAction, DepositSubmissionAction, DepositSubmissionErrorAction, DepositSubmissionSuccessAction, DiscardSubmissionErrorAction, DiscardSubmissionSuccessAction, InitSectionAction, InitSubmissionFormAction, SaveForLaterSubmissionFormSuccessAction, SaveSubmissionFormErrorAction, SaveSubmissionFormSuccessAction, SaveSubmissionSectionFormErrorAction, SaveSubmissionSectionFormSuccessAction, SubmissionObjectActionTypes, UpdateSectionDataAction } from './submission-objects.actions';
import { SectionsService } from '../sections/sections.service';
import { isEmpty, isNotEmpty, isNotUndefined } from '../../shared/empty.util';
import { SubmissionService } from '../submission.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import parseSectionErrors from '../utils/parseSectionErrors';
import { SectionsType } from '../sections/sections-type';
import { SubmissionJsonPatchOperationsService } from '../../core/submission/submission-json-patch-operations.service';
var SubmissionObjectEffects = /** @class */ (function () {
    function SubmissionObjectEffects(actions$, notificationsService, operationsService, sectionService, store$, submissionService, translate) {
        var _this = this;
        this.actions$ = actions$;
        this.notificationsService = notificationsService;
        this.operationsService = operationsService;
        this.sectionService = sectionService;
        this.store$ = store$;
        this.submissionService = submissionService;
        this.translate = translate;
        /**
         * Dispatch a [InitSectionAction] for every submission sections and dispatch a [CompleteInitSubmissionFormAction]
         */
        this.loadForm$ = this.actions$.pipe(ofType(SubmissionObjectActionTypes.INIT_SUBMISSION_FORM), map(function (action) {
            var definition = action.payload.submissionDefinition;
            var mappedActions = [];
            definition.sections.page.forEach(function (sectionDefinition) {
                var sectionId = sectionDefinition._links.self.substr(sectionDefinition._links.self.lastIndexOf('/') + 1);
                var config = sectionDefinition._links.config || '';
                var enabled = (sectionDefinition.mandatory) || (isNotEmpty(action.payload.sections) && action.payload.sections.hasOwnProperty(sectionId));
                var sectionData = (isNotUndefined(action.payload.sections) && isNotUndefined(action.payload.sections[sectionId])) ? action.payload.sections[sectionId] : Object.create(null);
                var sectionErrors = null;
                mappedActions.push(new InitSectionAction(action.payload.submissionId, sectionId, sectionDefinition.header, config, sectionDefinition.mandatory, sectionDefinition.sectionType, sectionDefinition.visibility, enabled, sectionData, sectionErrors));
            });
            return { action: action, definition: definition, mappedActions: mappedActions };
        }), mergeMap(function (result) {
            return observableFrom(result.mappedActions.concat(new CompleteInitSubmissionFormAction(result.action.payload.submissionId)));
        }));
        /**
         * Dispatch a [InitSubmissionFormAction]
         */
        this.resetForm$ = this.actions$.pipe(ofType(SubmissionObjectActionTypes.RESET_SUBMISSION_FORM), map(function (action) {
            return new InitSubmissionFormAction(action.payload.collectionId, action.payload.submissionId, action.payload.selfUrl, action.payload.submissionDefinition, action.payload.sections, null);
        }));
        /**
         * Dispatch a [SaveSubmissionFormSuccessAction] or a [SaveSubmissionFormErrorAction] on error
         */
        this.saveSubmission$ = this.actions$.pipe(ofType(SubmissionObjectActionTypes.SAVE_SUBMISSION_FORM), switchMap(function (action) {
            return _this.operationsService.jsonPatchByResourceType(_this.submissionService.getSubmissionObjectLinkName(), action.payload.submissionId, 'sections').pipe(map(function (response) { return new SaveSubmissionFormSuccessAction(action.payload.submissionId, response); }), catchError(function () { return observableOf(new SaveSubmissionFormErrorAction(action.payload.submissionId)); }));
        }));
        /**
         * Dispatch a [SaveForLaterSubmissionFormSuccessAction] or a [SaveSubmissionFormErrorAction] on error
         */
        this.saveForLaterSubmission$ = this.actions$.pipe(ofType(SubmissionObjectActionTypes.SAVE_FOR_LATER_SUBMISSION_FORM), switchMap(function (action) {
            return _this.operationsService.jsonPatchByResourceType(_this.submissionService.getSubmissionObjectLinkName(), action.payload.submissionId, 'sections').pipe(map(function (response) { return new SaveForLaterSubmissionFormSuccessAction(action.payload.submissionId, response); }), catchError(function () { return observableOf(new SaveSubmissionFormErrorAction(action.payload.submissionId)); }));
        }));
        /**
         * Call parseSaveResponse and dispatch actions
         */
        this.saveSubmissionSuccess$ = this.actions$.pipe(ofType(SubmissionObjectActionTypes.SAVE_SUBMISSION_FORM_SUCCESS, SubmissionObjectActionTypes.SAVE_SUBMISSION_SECTION_FORM_SUCCESS), withLatestFrom(this.store$), map(function (_a) {
            var action = _a[0], currentState = _a[1];
            return _this.parseSaveResponse(currentState.submission.objects[action.payload.submissionId], action.payload.submissionObject, action.payload.submissionId);
        }), mergeMap(function (actions) { return observableFrom(actions); }));
        /**
         * Dispatch a [SaveSubmissionSectionFormSuccessAction] or a [SaveSubmissionSectionFormErrorAction] on error
         */
        this.saveSection$ = this.actions$.pipe(ofType(SubmissionObjectActionTypes.SAVE_SUBMISSION_SECTION_FORM), switchMap(function (action) {
            return _this.operationsService.jsonPatchByResourceID(_this.submissionService.getSubmissionObjectLinkName(), action.payload.submissionId, 'sections', action.payload.sectionId).pipe(map(function (response) { return new SaveSubmissionSectionFormSuccessAction(action.payload.submissionId, response); }), catchError(function () { return observableOf(new SaveSubmissionSectionFormErrorAction(action.payload.submissionId)); }));
        }));
        /**
         * Show a notification on error
         */
        this.saveError$ = this.actions$.pipe(ofType(SubmissionObjectActionTypes.SAVE_SUBMISSION_FORM_ERROR, SubmissionObjectActionTypes.SAVE_SUBMISSION_SECTION_FORM_ERROR), withLatestFrom(this.store$), tap(function () { return _this.notificationsService.error(null, _this.translate.get('submission.sections.general.save_error_notice')); }));
        /**
         * Call parseSaveResponse and dispatch actions or dispatch [SaveSubmissionFormErrorAction] on error
         */
        this.saveAndDeposit$ = this.actions$.pipe(ofType(SubmissionObjectActionTypes.SAVE_AND_DEPOSIT_SUBMISSION), withLatestFrom(this.store$), switchMap(function (_a) {
            var action = _a[0], currentState = _a[1];
            return _this.operationsService.jsonPatchByResourceType(_this.submissionService.getSubmissionObjectLinkName(), action.payload.submissionId, 'sections').pipe(map(function (response) {
                if (_this.canDeposit(response)) {
                    return new DepositSubmissionAction(action.payload.submissionId);
                }
                else {
                    _this.notificationsService.warning(null, _this.translate.get('submission.sections.general.sections_not_valid'));
                    return _this.parseSaveResponse(currentState.submission.objects[action.payload.submissionId], response, action.payload.submissionId);
                }
            }), catchError(function () { return observableOf(new SaveSubmissionFormErrorAction(action.payload.submissionId)); }));
        }));
        /**
         * Dispatch a [DepositSubmissionSuccessAction] or a [DepositSubmissionErrorAction] on error
         */
        this.depositSubmission$ = this.actions$.pipe(ofType(SubmissionObjectActionTypes.DEPOSIT_SUBMISSION), withLatestFrom(this.store$), switchMap(function (_a) {
            var action = _a[0], state = _a[1];
            return _this.submissionService.depositSubmission(state.submission.objects[action.payload.submissionId].selfUrl).pipe(map(function () { return new DepositSubmissionSuccessAction(action.payload.submissionId); }), catchError(function () { return observableOf(new DepositSubmissionErrorAction(action.payload.submissionId)); }));
        }));
        /**
         * Show a notification on success and redirect to MyDSpace page
         */
        this.saveForLaterSubmissionSuccess$ = this.actions$.pipe(ofType(SubmissionObjectActionTypes.SAVE_FOR_LATER_SUBMISSION_FORM_SUCCESS), tap(function () { return _this.notificationsService.success(null, _this.translate.get('submission.sections.general.save_success_notice')); }), tap(function () { return _this.submissionService.redirectToMyDSpace(); }));
        /**
         * Show a notification on success and redirect to MyDSpace page
         */
        this.depositSubmissionSuccess$ = this.actions$.pipe(ofType(SubmissionObjectActionTypes.DEPOSIT_SUBMISSION_SUCCESS), tap(function () { return _this.notificationsService.success(null, _this.translate.get('submission.sections.general.deposit_success_notice')); }), tap(function () { return _this.submissionService.redirectToMyDSpace(); }));
        /**
         * Show a notification on error
         */
        this.depositSubmissionError$ = this.actions$.pipe(ofType(SubmissionObjectActionTypes.DEPOSIT_SUBMISSION_ERROR), tap(function () { return _this.notificationsService.error(null, _this.translate.get('submission.sections.general.deposit_error_notice')); }));
        /**
         * Dispatch a [DiscardSubmissionSuccessAction] or a [DiscardSubmissionErrorAction] on error
         */
        this.discardSubmission$ = this.actions$.pipe(ofType(SubmissionObjectActionTypes.DISCARD_SUBMISSION), switchMap(function (action) {
            return _this.submissionService.discardSubmission(action.payload.submissionId).pipe(map(function () { return new DiscardSubmissionSuccessAction(action.payload.submissionId); }), catchError(function () { return observableOf(new DiscardSubmissionErrorAction(action.payload.submissionId)); }));
        }));
        /**
         * Show a notification on success and redirect to MyDSpace page
         */
        this.discardSubmissionSuccess$ = this.actions$.pipe(ofType(SubmissionObjectActionTypes.DISCARD_SUBMISSION_SUCCESS), tap(function () { return _this.notificationsService.success(null, _this.translate.get('submission.sections.general.discard_success_notice')); }), tap(function () { return _this.submissionService.redirectToMyDSpace(); }));
        /**
         * Show a notification on error
         */
        this.discardSubmissionError$ = this.actions$.pipe(ofType(SubmissionObjectActionTypes.DISCARD_SUBMISSION_ERROR), tap(function () { return _this.notificationsService.error(null, _this.translate.get('submission.sections.general.discard_error_notice')); }));
    }
    /**
     * Check if the submission object retrieved from REST haven't section errors
     *
     * @param response
     *    The submission object retrieved from REST
     */
    SubmissionObjectEffects.prototype.canDeposit = function (response) {
        var canDeposit = true;
        if (isNotEmpty(response)) {
            response.forEach(function (item) {
                var errors = item.errors;
                if (errors && !isEmpty(errors)) {
                    canDeposit = false;
                }
            });
        }
        return canDeposit;
    };
    /**
     * Parse the submission object retrieved from REST and return actions to dispatch
     *
     * @param currentState
     *    The current SubmissionObjectEntry
     * @param response
     *    The submission object retrieved from REST
     * @param submissionId
     *    The submission id
     * @param notify
     *    A boolean that indicate if show notification or not
     * @return SubmissionObjectAction[]
     *    List of SubmissionObjectAction to dispatch
     */
    SubmissionObjectEffects.prototype.parseSaveResponse = function (currentState, response, submissionId, notify) {
        var _this = this;
        if (notify === void 0) { notify = true; }
        var mappedActions = [];
        if (isNotEmpty(response)) {
            if (notify) {
                this.notificationsService.success(null, this.translate.get('submission.sections.general.save_success_notice'));
            }
            response.forEach(function (item) {
                var errorsList = Object.create({});
                var errors = item.errors;
                if (errors && !isEmpty(errors)) {
                    // to avoid dispatching an action for every error, create an array of errors per section
                    errorsList = parseSectionErrors(errors);
                    if (notify) {
                        _this.notificationsService.warning(null, _this.translate.get('submission.sections.general.sections_not_valid'));
                    }
                }
                var sections = (item.sections && isNotEmpty(item.sections)) ? item.sections : {};
                var sectionsKeys = union(Object.keys(sections), Object.keys(errorsList));
                for (var _i = 0, sectionsKeys_1 = sectionsKeys; _i < sectionsKeys_1.length; _i++) {
                    var sectionId = sectionsKeys_1[_i];
                    var sectionErrors = errorsList[sectionId] || [];
                    var sectionData = sections[sectionId] || {};
                    // When Upload section is disabled, add to submission only if there are files
                    if (currentState.sections[sectionId].sectionType === SectionsType.Upload
                        && isEmpty(sectionData.files)
                        && !currentState.sections[sectionId].enabled) {
                        continue;
                    }
                    if (notify && !currentState.sections[sectionId].enabled) {
                        _this.submissionService.notifyNewSection(submissionId, sectionId, currentState.sections[sectionId].sectionType);
                    }
                    mappedActions.push(new UpdateSectionDataAction(submissionId, sectionId, sectionData, sectionErrors));
                }
            });
        }
        return mappedActions;
    };
    tslib_1.__decorate([
        Effect(),
        tslib_1.__metadata("design:type", Object)
    ], SubmissionObjectEffects.prototype, "loadForm$", void 0);
    tslib_1.__decorate([
        Effect(),
        tslib_1.__metadata("design:type", Object)
    ], SubmissionObjectEffects.prototype, "resetForm$", void 0);
    tslib_1.__decorate([
        Effect(),
        tslib_1.__metadata("design:type", Object)
    ], SubmissionObjectEffects.prototype, "saveSubmission$", void 0);
    tslib_1.__decorate([
        Effect(),
        tslib_1.__metadata("design:type", Object)
    ], SubmissionObjectEffects.prototype, "saveForLaterSubmission$", void 0);
    tslib_1.__decorate([
        Effect(),
        tslib_1.__metadata("design:type", Object)
    ], SubmissionObjectEffects.prototype, "saveSubmissionSuccess$", void 0);
    tslib_1.__decorate([
        Effect(),
        tslib_1.__metadata("design:type", Object)
    ], SubmissionObjectEffects.prototype, "saveSection$", void 0);
    tslib_1.__decorate([
        Effect({ dispatch: false }),
        tslib_1.__metadata("design:type", Object)
    ], SubmissionObjectEffects.prototype, "saveError$", void 0);
    tslib_1.__decorate([
        Effect(),
        tslib_1.__metadata("design:type", Object)
    ], SubmissionObjectEffects.prototype, "saveAndDeposit$", void 0);
    tslib_1.__decorate([
        Effect(),
        tslib_1.__metadata("design:type", Object)
    ], SubmissionObjectEffects.prototype, "depositSubmission$", void 0);
    tslib_1.__decorate([
        Effect({ dispatch: false }),
        tslib_1.__metadata("design:type", Object)
    ], SubmissionObjectEffects.prototype, "saveForLaterSubmissionSuccess$", void 0);
    tslib_1.__decorate([
        Effect({ dispatch: false }),
        tslib_1.__metadata("design:type", Object)
    ], SubmissionObjectEffects.prototype, "depositSubmissionSuccess$", void 0);
    tslib_1.__decorate([
        Effect({ dispatch: false }),
        tslib_1.__metadata("design:type", Object)
    ], SubmissionObjectEffects.prototype, "depositSubmissionError$", void 0);
    tslib_1.__decorate([
        Effect(),
        tslib_1.__metadata("design:type", Object)
    ], SubmissionObjectEffects.prototype, "discardSubmission$", void 0);
    tslib_1.__decorate([
        Effect({ dispatch: false }),
        tslib_1.__metadata("design:type", Object)
    ], SubmissionObjectEffects.prototype, "discardSubmissionSuccess$", void 0);
    tslib_1.__decorate([
        Effect({ dispatch: false }),
        tslib_1.__metadata("design:type", Object)
    ], SubmissionObjectEffects.prototype, "discardSubmissionError$", void 0);
    SubmissionObjectEffects = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [Actions,
            NotificationsService,
            SubmissionJsonPatchOperationsService,
            SectionsService,
            Store,
            SubmissionService,
            TranslateService])
    ], SubmissionObjectEffects);
    return SubmissionObjectEffects;
}());
export { SubmissionObjectEffects };
//# sourceMappingURL=submission-objects.effects.js.map