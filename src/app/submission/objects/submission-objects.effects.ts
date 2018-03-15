import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';

import * as DEDUPLICATION_SECTION from '../../../backend/data/section-deduplication.json';

import {
  CompleteInitSubmissionFormAction,
  CompleteSaveSubmissionFormAction, DepositSubmissionAction, DepositSubmissionErrorAction,
  DepositSubmissionSuccessAction,
  InitSubmissionFormAction,
  LoadSubmissionFormAction,
  ResetSubmissionFormAction,
  SaveSubmissionFormAction,
  SaveSubmissionSectionFormAction, SaveSubmissionFormSuccessAction,
  SubmissionObjectActionTypes,
  UpdateSectionDataAction, SaveSubmissionFormErrorAction, SaveSubmissionSectionFormSuccessAction,
  SaveSubmissionSectionFormErrorAction, SetWorkspaceDuplicatedAction, SetWorkspaceDuplicatedSuccessAction,
  SetWorkspaceDuplicatedErrorAction, SetWorkflowDuplicatedAction, SetWorkflowDuplicatedSuccessAction,
  SetWorkflowDuplicatedErrorAction
} from './submission-objects.actions';
import { SectionService } from '../section/section.service';
import { InitDefaultDefinitionAction } from '../definitions/submission-definitions.actions';
import { isEmpty, isNotEmpty } from '../../shared/empty.util';
import { Workspaceitem, WorkspaceItemError } from '../../core/submission/models/workspaceitem.model';
import { default as parseSectionErrorPaths, SectionErrorPath } from '../utils/parseSectionErrorPaths';
import { Observable } from 'rxjs/Observable';
import { JsonPatchOperationsService } from '../../core/json-patch/json-patch-operations.service';
import { SubmitDataResponseDefinitionObject } from '../../core/shared/submit-data-response-definition.model';
import { SubmissionService } from '../submission.service';
import { Action, Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { Workflowitem } from '../../core/submission/models/workflowitem.model';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { SubmissionObject } from '../../core/submission/models/submission-object.model';
import { TranslateService } from '@ngx-translate/core';
import { NotificationOptions } from '../../shared/notifications/models/notification-options.model';
import { AuthStatus } from '../../core/auth/models/auth-status.model';
import {
  AuthActionTypes, AuthenticateAction, AuthenticatedAction, AuthenticationErrorAction,
  AuthenticationSuccessAction, LogOutSuccessAction
} from '../../core/auth/auth.actions';
import { DeduplicationService } from '../section/deduplication/deduplication.service';
import { JsonPatchOperationsBuilder } from '../../core/json-patch/builder/json-patch-operations-builder';
import { JsonPatchOperationPathCombiner } from '../../core/json-patch/builder/json-patch-operation-path-combiner';

@Injectable()
export class SubmissionObjectEffects {

  @Effect() loadForm$ = this.actions$
    .ofType(SubmissionObjectActionTypes.LOAD_SUBMISSION_FORM)
    .map((action: LoadSubmissionFormAction) =>
      new InitDefaultDefinitionAction(action.payload.collectionId, action.payload.submissionId, action.payload.selfUrl, action.payload.sections));

  @Effect() resetForm$ = this.actions$
    .ofType(SubmissionObjectActionTypes.RESET_SUBMISSION_FORM)
    .do((action: ResetSubmissionFormAction) => this.sectionService.removeAllSections(action.payload.submissionId))
    .map((action: ResetSubmissionFormAction) =>
      new LoadSubmissionFormAction(action.payload.collectionId, action.payload.submissionId, action.payload.selfUrl, action.payload.sections));

  @Effect() initForm$ = this.actions$
    .ofType(SubmissionObjectActionTypes.INIT_SUBMISSION_FORM)
    .do((action: InitSubmissionFormAction) => {
      this.sectionService.loadDefaultSections(action.payload.collectionId,
        action.payload.submissionId,
        action.payload.definitionId,
        action.payload.sections);
    })
    .map((action: InitSubmissionFormAction) => new CompleteInitSubmissionFormAction(action.payload.submissionId));

  @Effect() saveSubmission$ = this.actions$
    .ofType(SubmissionObjectActionTypes.SAVE_SUBMISSION_FORM)
    .switchMap((action: SaveSubmissionFormAction) => {
      return this.operationsService.jsonPatchByResourceType(
        this.submissionService.getSubmissionObjectLinkName(),
        action.payload.submissionId,
        'sections')
        .map((response: SubmissionObject[]) => new SaveSubmissionFormSuccessAction(action.payload.submissionId, response))
        .catch(() => Observable.of(new SaveSubmissionFormErrorAction(action.payload.submissionId)));
    });

  @Effect() saveSubmissionSuccess$ = this.actions$
    .ofType(SubmissionObjectActionTypes.SAVE_SUBMISSION_FORM_SUCCESS, SubmissionObjectActionTypes.SAVE_SUBMISSION_SECTION_FORM_SUCCESS)
    .map((action: SaveSubmissionFormSuccessAction | SaveSubmissionSectionFormSuccessAction) => {
      return this.parseSaveResponse(action.payload.submissionObject, action.payload.submissionId);
    })
    .mergeMap((actions) => {
      return Observable.from(actions);
    });

  // @Effect() saveSubmission$ = this.actions$
  //   .ofType(SubmissionObjectActionTypes.SAVE_SUBMISSION_FORM)
  //   .switchMap((action: SaveSubmissionFormAction) => {
  //     return this.operationsService.jsonPatchByResourceType(
  //       this.submissionService.getSubmissionObjectLinkName(),
  //       action.payload.submissionId,
  //       'sections')
  //       .map((response: Workspaceitem[] | Workflowitem[]) => {
  //         return this.parseSaveResponse(response, action.payload.submissionId);
  //       });
  //   })
  //   .mergeMap((actions) => {
  //     return Observable.from(actions);
  //   });

  @Effect() saveSection$ = this.actions$
    .ofType(SubmissionObjectActionTypes.SAVE_SUBMISSION_SECTION_FORM)
    .switchMap((action: SaveSubmissionSectionFormAction) => {
      return this.operationsService.jsonPatchByResourceID(
        this.submissionService.getSubmissionObjectLinkName(),
        action.payload.submissionId,
        'sections',
        action.payload.sectionId)
        .map((response: SubmissionObject[]) => new SaveSubmissionSectionFormSuccessAction(action.payload.submissionId, response))
        .catch(() => Observable.of(new SaveSubmissionSectionFormErrorAction(action.payload.submissionId)));
    });

  @Effect() depositSubmission$ = this.actions$
    .ofType(SubmissionObjectActionTypes.DEPOSIT_SUBMISSION)
    .withLatestFrom(this.store$)
    .switchMap(([action, state]: [DepositSubmissionAction, any]) => {
      return this.submissionService.depositSubmission(state.submission.objects[action.payload.submissionId].selfUrl)
        .map(() => new DepositSubmissionSuccessAction(action.payload.submissionId))
        .catch((e) => Observable.of(new DepositSubmissionErrorAction(action.payload.submissionId)));
    });

  @Effect({dispatch: false}) depositSubmissionSuccess$ = this.actions$
    .ofType(SubmissionObjectActionTypes.DEPOSIT_SUBMISSION_SUCCESS)
    .withLatestFrom(this.store$)
    .do(() => this.submissionService.redirectToMyDSpace());

  @Effect()
  public wsDuplication: Observable<Action> = this.actions$
    .ofType(SubmissionObjectActionTypes.SET_WORKSPACE_DUPLICATION)
    .map((action: SetWorkspaceDuplicatedAction) => {
      // return this.deduplicationService.setWorkspaceDuplicated(action.payload)
      //   .first()
      //   .map((response) => {
      console.log('Effect of SET_WORKSPACE_DUPLICATION');
      // TODO JSON PATCH
      // const pathCombiner = new JsonPatchOperationPathCombiner('sections', 'deduplication');
      // const path = ''; // `metadata/${metadataKey}`; // TODO
      // this.operationsBuilder.add(pathCombiner.getPath(path), action.payload, true);
      return new SetWorkspaceDuplicatedSuccessAction(action.payload);
    })
    .catch((error) => Observable.of(new SetWorkspaceDuplicatedErrorAction(error)));

  @Effect({dispatch: false})
  public wsDuplicationSuccess: Observable<Action> = this.actions$
    .ofType(SubmissionObjectActionTypes.SET_WORKSPACE_DUPLICATION_SUCCESS)
    // TODO
    .do((action: SetWorkspaceDuplicatedAction) => {
      console.log('Effect of SET_WORKSPACE_DUPLICATION_SUCCESS');
      this.deduplicationService.setWorkspaceDuplicationSuccess(action.payload);
    });

  @Effect({dispatch: false})
  public wsDuplicationError: Observable<Action> = this.actions$
    .ofType(SubmissionObjectActionTypes.SET_WORKSPACE_DUPLICATION_ERROR)
    .do((action: SetWorkspaceDuplicatedAction) => {
      console.log('Effect of SET_WORKSPACE_DUPLICATION_ERROR');
      this.deduplicationService.setWorkspaceDuplicationError(action.payload);
    });

  @Effect()
  public wfDuplication: Observable<Action> = this.actions$
    .ofType(SubmissionObjectActionTypes.SET_WORKFLOW_DUPLICATION)
    .map((action: SetWorkflowDuplicatedAction) => {
      // return this.deduplicationService.setWorkflowDuplicated(action.payload)
      //   .first()
      //   .map((response) => {
      console.log('Effect of SET_WORKFLOW_DUPLICATION');
      // TODO JSON PATCH
      // const pathCombiner = new JsonPatchOperationPathCombiner('sections', 'deduplication');
      // const path = ''; // `metadata/${metadataKey}`; // TODO
      // this.operationsBuilder.add(pathCombiner.getPath(path), action.payload, true);
      return new SetWorkflowDuplicatedSuccessAction(action.payload);
    })
    .catch((error) => Observable.of(new SetWorkflowDuplicatedErrorAction(error)));

  @Effect({dispatch: false})
  public wfDuplicationSuccess: Observable<Action> = this.actions$
    .ofType(SubmissionObjectActionTypes.SET_WORKFLOW_DUPLICATION_SUCCESS)
    // TODO
    .do((action: SetWorkflowDuplicatedAction) => {
      console.log('Effect of SET_WORKFLOW_DUPLICATION_SUCCESS');
      this.deduplicationService.setWorkflowDuplicationSuccess(action.payload);
    });

  @Effect({dispatch: false})
  public wfDuplicationError: Observable<Action> = this.actions$
    .ofType(SubmissionObjectActionTypes.SET_WORKFLOW_DUPLICATION_ERROR)
    .do((action: SetWorkflowDuplicatedAction) => {
      console.log('Effect of SET_WORKFLOW_DUPLICATION_ERROR');
      this.deduplicationService.setWorkflowDuplicationError(action.payload);
    });

  constructor(private actions$: Actions,
              private notificationsService: NotificationsService,
              private operationsService: JsonPatchOperationsService<SubmitDataResponseDefinitionObject>,
              private sectionService: SectionService,
              private store$: Store<AppState>,
              private submissionService: SubmissionService,
              private deduplicationService: DeduplicationService,
              private translate: TranslateService,
              private operationsBuilder: JsonPatchOperationsBuilder) {
  }

  protected parseSaveResponse(response: SubmissionObject[], submissionId: string) {
    const mappedActions = [];
    if (isNotEmpty(response)) {
      this.notificationsService.success(null, this.translate.get('submission.section.general.save_success_notice'));

      const errorsList = {};

      // to avoid dispatching an action for every error, create an array of errors per section
      response.forEach((item: Workspaceitem | Workflowitem) => {

        const {errors} = item;

        if (errors && !isEmpty(errors)) {
          errors.forEach((error: WorkspaceItemError) => {
            const paths: SectionErrorPath[] = parseSectionErrorPaths(error.paths);

            paths.forEach((path: SectionErrorPath) => {
              const sectionError = {path: path.originalPath, message: error.message};
              if (!errorsList[path.sectionId]) {
                errorsList[path.sectionId] = [];
              }
              errorsList[path.sectionId].push(sectionError);
            });
          });
          this.notificationsService.warning(null, this.translate.get('submission.section.general.sections_not_valid'));
        }

        // Original Code
        // and now dispatch an action to update section's data and errors
        const {sections} = item;
        if (sections && isNotEmpty(sections)) {
          Object.keys(sections)
            .forEach((sectionId) => {
              const sectionErrors = errorsList[sectionId] || [];
              mappedActions.push(new UpdateSectionDataAction(submissionId, sectionId, sections[sectionId], sectionErrors));
            });
        }
      });
      // End Original Code

      // Deduplication Modify
      //   const {sections} = item;
      //   if (sections && isNotEmpty(sections)) {
      //     // const sectionss = Object.assign({}, sections, Object.assign({}, sections.deduplication, {data: DEDUPLICATION_SECTION}) );
      //     const sectionss = Object.assign({}, sections, {deduplication: DEDUPLICATION_SECTION});
      //     console.log(sectionss);
      //     Object.keys(sectionss)
      //       .forEach((sectionId) => {
      //         const sectionErrors = errorsList[sectionId] || [];
      //         mappedActions.push(new UpdateSectionDataAction(submissionId, sectionId, sectionss[sectionId], sectionErrors));
      //       });
      //   }
      // });
      // End Deduplication Modify

    }
    // mappedActions.push(new CompleteSaveSubmissionFormAction(submissionId));
    return mappedActions;
  }

}
