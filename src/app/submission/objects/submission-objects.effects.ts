import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects'

import {
  CompleteInitSubmissionFormAction,
  CompleteSaveSubmissionFormAction, DepositSubmissionAction, DepositSubmissionErrorAction,
  DepositSubmissionSuccessAction,
  InitSubmissionFormAction,
  LoadSubmissionFormAction,
  ResetSubmissionFormAction,
  SaveSubmissionFormAction,
  SaveSubmissionSectionFormAction,
  SubmissionObjectActionTypes,
  UpdateSectionDataAction
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
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { Workflowitem } from '../../core/submission/models/workflowitem.model';

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
        .map((response: Workspaceitem[] | Workflowitem[]) => {
          return this.parseSaveResponse(response, action.payload.submissionId);
        });
    })
    .mergeMap((actions) => {
      return Observable.from(actions);
    });

  @Effect() saveSection$ = this.actions$
    .ofType(SubmissionObjectActionTypes.SAVE_SUBMISSION_SECTION_FORM)
    .switchMap((action: SaveSubmissionSectionFormAction) => {
      return this.operationsService.jsonPatchByResourceID(
        this.submissionService.getSubmissionObjectLinkName(),
        action.payload.submissionId,
        'sections',
        action.payload.sectionId)
        .map((response: Workspaceitem[] | Workflowitem[]) => {
          return this.parseSaveResponse(response, action.payload.submissionId);
        });
    })
    .mergeMap((actions) => {
      return Observable.from(actions);
    });

  @Effect() depositSubmission$ = this.actions$
    .ofType(SubmissionObjectActionTypes.DEPOSIT_SUBMISSION)
    .withLatestFrom(this.store$)
    .switchMap(([action, state]: [DepositSubmissionAction, any]) => {
      return this.submissionService.depositSubmission(state.submission.objects[action.payload.submissionId].selfUrl)
        .map(() => new DepositSubmissionSuccessAction(action.payload.submissionId))
        .catch((e) => Observable.of(new DepositSubmissionErrorAction(action.payload.submissionId)))
    });

  @Effect({dispatch: false}) depositSubmissionSuccess$ = this.actions$
    .ofType(SubmissionObjectActionTypes.DEPOSIT_SUBMISSION_SUCCESS)
    .withLatestFrom(this.store$)
    .do(() => this.submissionService.redirectToMyDSpace());

  constructor(private actions$: Actions,
              private operationsService: JsonPatchOperationsService<SubmitDataResponseDefinitionObject>,
              private sectionService: SectionService,
              private store$: Store<AppState>,
              private submissionService: SubmissionService) {
  }

  protected parseSaveResponse(response: Workspaceitem[] | Workflowitem[], submissionId: string) {
    const mappedActions = [];
    if (isNotEmpty(response)) {
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
        }

        // and now dispatch an action to update section's data and errors
        const {sections} = item;
        if (sections && isNotEmpty(sections)) {
          Object.keys(sections)
            .forEach((sectionId) => {
              const sectionErrors = errorsList[sectionId] || [];
              mappedActions.push(new UpdateSectionDataAction(submissionId, sectionId, sections[sectionId], sectionErrors));
            })
        }
      });
    }
    mappedActions.push(new CompleteSaveSubmissionFormAction(submissionId));
    return mappedActions;
  }
}
