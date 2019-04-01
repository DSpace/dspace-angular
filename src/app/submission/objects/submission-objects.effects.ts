import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { from as observableFrom, of as observableOf } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { union } from 'lodash';

import {
  CompleteInitSubmissionFormAction,
  DepositSubmissionAction,
  DepositSubmissionErrorAction,
  DepositSubmissionSuccessAction,
  DiscardSubmissionErrorAction,
  DiscardSubmissionSuccessAction,
  InitSectionAction,
  InitSubmissionFormAction,
  ResetSubmissionFormAction,
  SaveAndDepositSubmissionAction,
  SaveForLaterSubmissionFormAction,
  SaveForLaterSubmissionFormSuccessAction,
  SaveSubmissionFormAction,
  SaveSubmissionFormErrorAction,
  SaveSubmissionFormSuccessAction,
  SaveSubmissionSectionFormAction,
  SaveSubmissionSectionFormErrorAction,
  SaveSubmissionSectionFormSuccessAction, SubmissionObjectAction,
  SubmissionObjectActionTypes,
  UpdateSectionDataAction
} from './submission-objects.actions';
import { SectionsService } from '../sections/sections.service';
import { isEmpty, isNotEmpty, isNotUndefined } from '../../shared/empty.util';
import { Workspaceitem } from '../../core/submission/models/workspaceitem.model';
import { SubmissionService } from '../submission.service';
import { Workflowitem } from '../../core/submission/models/workflowitem.model';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { SubmissionObject } from '../../core/submission/models/submission-object.model';
import { TranslateService } from '@ngx-translate/core';
import { SubmissionState } from '../submission.reducers';
import { SubmissionObjectEntry } from './submission-objects.reducer';
import { SubmissionSectionModel } from '../../core/config/models/config-submission-section.model';
import parseSectionErrors from '../utils/parseSectionErrors';
import { WorkspaceitemSectionsObject } from '../../core/submission/models/workspaceitem-sections.model';
import { WorkspaceitemSectionUploadObject } from '../../core/submission/models/workspaceitem-section-upload.model';
import { SectionsType } from '../sections/sections-type';
import { SubmissionJsonPatchOperationsService } from '../../core/submission/submission-json-patch-operations.service';

@Injectable()
export class SubmissionObjectEffects {

  /**
   * Dispatch a [InitSectionAction] for every submission sections and dispatch a [CompleteInitSubmissionFormAction]
   */
  @Effect() loadForm$ = this.actions$.pipe(
    ofType(SubmissionObjectActionTypes.INIT_SUBMISSION_FORM),
    map((action: InitSubmissionFormAction) => {
      const definition = action.payload.submissionDefinition;
      const mappedActions = [];
      definition.sections.page.forEach((sectionDefinition: SubmissionSectionModel) => {
        const sectionId = sectionDefinition._links.self.substr(sectionDefinition._links.self.lastIndexOf('/') + 1);
        const config = sectionDefinition._links.config || '';
        const enabled = (sectionDefinition.mandatory) || (isNotEmpty(action.payload.sections) && action.payload.sections.hasOwnProperty(sectionId));
        const sectionData = (isNotUndefined(action.payload.sections) && isNotUndefined(action.payload.sections[sectionId])) ? action.payload.sections[sectionId] : Object.create(null);
        const sectionErrors = null;
        mappedActions.push(
          new InitSectionAction(
            action.payload.submissionId,
            sectionId,
            sectionDefinition.header,
            config,
            sectionDefinition.mandatory,
            sectionDefinition.sectionType,
            sectionDefinition.visibility,
            enabled,
            sectionData,
            sectionErrors
          )
        )
      });
      return {action: action, definition: definition, mappedActions: mappedActions};
    }),
    mergeMap((result) => {
      return observableFrom(
        result.mappedActions.concat(
          new CompleteInitSubmissionFormAction(result.action.payload.submissionId)
        ));
    }));

  /**
   * Dispatch a [InitSubmissionFormAction]
   */
  @Effect() resetForm$ = this.actions$.pipe(
    ofType(SubmissionObjectActionTypes.RESET_SUBMISSION_FORM),
    map((action: ResetSubmissionFormAction) =>
      new InitSubmissionFormAction(
        action.payload.collectionId,
        action.payload.submissionId,
        action.payload.selfUrl,
        action.payload.submissionDefinition,
        action.payload.sections,
        null
      )));

  /**
   * Dispatch a [SaveSubmissionFormSuccessAction] or a [SaveSubmissionFormErrorAction] on error
   */
  @Effect() saveSubmission$ = this.actions$.pipe(
    ofType(SubmissionObjectActionTypes.SAVE_SUBMISSION_FORM),
    switchMap((action: SaveSubmissionFormAction) => {
      return this.operationsService.jsonPatchByResourceType(
        this.submissionService.getSubmissionObjectLinkName(),
        action.payload.submissionId,
        'sections').pipe(
        map((response: SubmissionObject[]) => new SaveSubmissionFormSuccessAction(action.payload.submissionId, response)),
        catchError(() => observableOf(new SaveSubmissionFormErrorAction(action.payload.submissionId))));
    }));

  /**
   * Dispatch a [SaveForLaterSubmissionFormSuccessAction] or a [SaveSubmissionFormErrorAction] on error
   */
  @Effect() saveForLaterSubmission$ = this.actions$.pipe(
    ofType(SubmissionObjectActionTypes.SAVE_FOR_LATER_SUBMISSION_FORM),
    switchMap((action: SaveForLaterSubmissionFormAction) => {
      return this.operationsService.jsonPatchByResourceType(
        this.submissionService.getSubmissionObjectLinkName(),
        action.payload.submissionId,
        'sections').pipe(
        map((response: SubmissionObject[]) => new SaveForLaterSubmissionFormSuccessAction(action.payload.submissionId, response)),
        catchError(() => observableOf(new SaveSubmissionFormErrorAction(action.payload.submissionId))));
    }));

  /**
   * Call parseSaveResponse and dispatch actions
   */
  @Effect() saveSubmissionSuccess$ = this.actions$.pipe(
    ofType(SubmissionObjectActionTypes.SAVE_SUBMISSION_FORM_SUCCESS, SubmissionObjectActionTypes.SAVE_SUBMISSION_SECTION_FORM_SUCCESS),
    withLatestFrom(this.store$),
    map(([action, currentState]: [SaveSubmissionFormSuccessAction | SaveSubmissionSectionFormSuccessAction, any]) => {
      return this.parseSaveResponse((currentState.submission as SubmissionState).objects[action.payload.submissionId], action.payload.submissionObject, action.payload.submissionId);
    }),
    mergeMap((actions) => observableFrom(actions)));

  /**
   * Dispatch a [SaveSubmissionSectionFormSuccessAction] or a [SaveSubmissionSectionFormErrorAction] on error
   */
  @Effect() saveSection$ = this.actions$.pipe(
    ofType(SubmissionObjectActionTypes.SAVE_SUBMISSION_SECTION_FORM),
    switchMap((action: SaveSubmissionSectionFormAction) => {
      return this.operationsService.jsonPatchByResourceID(
        this.submissionService.getSubmissionObjectLinkName(),
        action.payload.submissionId,
        'sections',
        action.payload.sectionId).pipe(
        map((response: SubmissionObject[]) => new SaveSubmissionSectionFormSuccessAction(action.payload.submissionId, response)),
        catchError(() => observableOf(new SaveSubmissionSectionFormErrorAction(action.payload.submissionId))));
    }));

  /**
   * Show a notification on error
   */
  @Effect({dispatch: false}) saveError$ = this.actions$.pipe(
    ofType(SubmissionObjectActionTypes.SAVE_SUBMISSION_FORM_ERROR, SubmissionObjectActionTypes.SAVE_SUBMISSION_SECTION_FORM_ERROR),
    withLatestFrom(this.store$),
    tap(() => this.notificationsService.error(null, this.translate.get('submission.sections.general.save_error_notice'))));

  /**
   * Call parseSaveResponse and dispatch actions or dispatch [SaveSubmissionFormErrorAction] on error
   */
  @Effect() saveAndDeposit$ = this.actions$.pipe(
    ofType(SubmissionObjectActionTypes.SAVE_AND_DEPOSIT_SUBMISSION),
    withLatestFrom(this.store$),
    switchMap(([action, currentState]: [SaveAndDepositSubmissionAction, any]) => {
      return this.operationsService.jsonPatchByResourceType(
        this.submissionService.getSubmissionObjectLinkName(),
        action.payload.submissionId,
        'sections').pipe(
        map((response: SubmissionObject[]) => {
          if (this.canDeposit(response)) {
            return new DepositSubmissionAction(action.payload.submissionId);
          } else {
            this.notificationsService.warning(null, this.translate.get('submission.sections.general.sections_not_valid'));
            return this.parseSaveResponse((currentState.submission as SubmissionState).objects[action.payload.submissionId], response, action.payload.submissionId);
          }
        }),
        catchError(() => observableOf(new SaveSubmissionFormErrorAction(action.payload.submissionId))));
    }));

  /**
   * Dispatch a [DepositSubmissionSuccessAction] or a [DepositSubmissionErrorAction] on error
   */
  @Effect() depositSubmission$ = this.actions$.pipe(
    ofType(SubmissionObjectActionTypes.DEPOSIT_SUBMISSION),
    withLatestFrom(this.store$),
    switchMap(([action, state]: [DepositSubmissionAction, any]) => {
      return this.submissionService.depositSubmission(state.submission.objects[action.payload.submissionId].selfUrl).pipe(
        map(() => new DepositSubmissionSuccessAction(action.payload.submissionId)),
        catchError(() => observableOf(new DepositSubmissionErrorAction(action.payload.submissionId))));
    }));

  /**
   * Show a notification on success and redirect to MyDSpace page
   */
  @Effect({dispatch: false}) saveForLaterSubmissionSuccess$ = this.actions$.pipe(
    ofType(SubmissionObjectActionTypes.SAVE_FOR_LATER_SUBMISSION_FORM_SUCCESS),
    tap(() => this.notificationsService.success(null, this.translate.get('submission.sections.general.save_success_notice'))),
    tap(() => this.submissionService.redirectToMyDSpace()));

  /**
   * Show a notification on success and redirect to MyDSpace page
   */
  @Effect({dispatch: false}) depositSubmissionSuccess$ = this.actions$.pipe(
    ofType(SubmissionObjectActionTypes.DEPOSIT_SUBMISSION_SUCCESS),
    tap(() => this.notificationsService.success(null, this.translate.get('submission.sections.general.deposit_success_notice'))),
    tap(() => this.submissionService.redirectToMyDSpace()));

  /**
   * Show a notification on error
   */
  @Effect({dispatch: false}) depositSubmissionError$ = this.actions$.pipe(
    ofType(SubmissionObjectActionTypes.DEPOSIT_SUBMISSION_ERROR),
    tap(() => this.notificationsService.error(null, this.translate.get('submission.sections.general.deposit_error_notice'))));

  /**
   * Dispatch a [DiscardSubmissionSuccessAction] or a [DiscardSubmissionErrorAction] on error
   */
  @Effect() discardSubmission$ = this.actions$.pipe(
    ofType(SubmissionObjectActionTypes.DISCARD_SUBMISSION),
    switchMap((action: DepositSubmissionAction) => {
      return this.submissionService.discardSubmission(action.payload.submissionId).pipe(
        map(() => new DiscardSubmissionSuccessAction(action.payload.submissionId)),
        catchError(() => observableOf(new DiscardSubmissionErrorAction(action.payload.submissionId))));
    }));

  /**
   * Show a notification on success and redirect to MyDSpace page
   */
  @Effect({dispatch: false}) discardSubmissionSuccess$ = this.actions$.pipe(
    ofType(SubmissionObjectActionTypes.DISCARD_SUBMISSION_SUCCESS),
    tap(() => this.notificationsService.success(null, this.translate.get('submission.sections.general.discard_success_notice'))),
    tap(() => this.submissionService.redirectToMyDSpace()));

  /**
   * Show a notification on error
   */
  @Effect({dispatch: false}) discardSubmissionError$ = this.actions$.pipe(
    ofType(SubmissionObjectActionTypes.DISCARD_SUBMISSION_ERROR),
    tap(() => this.notificationsService.error(null, this.translate.get('submission.sections.general.discard_error_notice'))));

  constructor(private actions$: Actions,
              private notificationsService: NotificationsService,
              private operationsService: SubmissionJsonPatchOperationsService,
              private sectionService: SectionsService,
              private store$: Store<any>,
              private submissionService: SubmissionService,
              private translate: TranslateService) {
  }

  /**
   * Check if the submission object retrieved from REST haven't section errors
   *
   * @param response
   *    The submission object retrieved from REST
   */
  protected canDeposit(response: SubmissionObject[]) {
    let canDeposit = true;

    if (isNotEmpty(response)) {
      response.forEach((item: Workspaceitem | Workflowitem) => {
        const {errors} = item;

        if (errors && !isEmpty(errors)) {
          canDeposit = false;
        }
      });
    }
    return canDeposit;
  }

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
  protected parseSaveResponse(
    currentState: SubmissionObjectEntry,
    response: SubmissionObject[],
    submissionId: string,
    notify: boolean = true): SubmissionObjectAction[] {

    const mappedActions = [];

    if (isNotEmpty(response)) {
      if (notify) {
        this.notificationsService.success(null, this.translate.get('submission.sections.general.save_success_notice'));
      }

      response.forEach((item: Workspaceitem | Workflowitem) => {

        let errorsList = Object.create({});
        const {errors} = item;

        if (errors && !isEmpty(errors)) {
          // to avoid dispatching an action for every error, create an array of errors per section
          errorsList = parseSectionErrors(errors);
          if (notify) {
            this.notificationsService.warning(null, this.translate.get('submission.sections.general.sections_not_valid'));
          }
        }

        const sections: WorkspaceitemSectionsObject = (item.sections && isNotEmpty(item.sections)) ? item.sections : {};
        const sectionsKeys: string[] = union(Object.keys(sections), Object.keys(errorsList));

        for (const sectionId of sectionsKeys) {
          const sectionErrors = errorsList[sectionId] || [];
          const sectionData = sections[sectionId] || {};

          // When Upload section is disabled, add to submission only if there are files
          if (currentState.sections[sectionId].sectionType === SectionsType.Upload
            && isEmpty((sectionData as WorkspaceitemSectionUploadObject).files)
            && !currentState.sections[sectionId].enabled) {
            continue;
          }

          if (notify && !currentState.sections[sectionId].enabled) {
            this.submissionService.notifyNewSection(submissionId, sectionId, currentState.sections[sectionId].sectionType);
          }
          mappedActions.push(new UpdateSectionDataAction(submissionId, sectionId, sectionData, sectionErrors));
        }

      });

    }

    return mappedActions;
  }

}
