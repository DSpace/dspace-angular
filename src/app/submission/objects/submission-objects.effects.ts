import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects'

import {
  LoadSubmissionFormAction, InitSubmissionFormAction, SubmissionObjectActionTypes,
  CompleteInitSubmissionFormAction, ResetSubmissionFormAction, SaveSubmissionFormAction,
  CompleteSaveSubmissionFormAction, InertSectionErrorsAction, UpdateSectionDataAction
} from './submission-objects.actions';
import { SectionService } from '../section/section.service';
import { InitDefaultDefinitionAction } from '../definitions/submission-definitions.actions';
import { SubmissionService } from '../submission.service';
import { SubmissionRestService } from '../submission-rest.service';
import { isEmpty, isNotEmpty } from '../../shared/empty.util';
import { WorkspaceItemError, WorkspaceitemObject } from '../models/workspaceitem.model';
import { default as parseSectionErrorPaths, SectionErrorPath } from '../utils/parseSectionErrorPaths';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SubmissionObjectEffects {

  @Effect() loadForm$ = this.actions$
    .ofType(SubmissionObjectActionTypes.LOAD_SUBMISSION_FORM)
    .map((action: LoadSubmissionFormAction) =>
      new InitDefaultDefinitionAction(action.payload.collectionId, action.payload.submissionId, action.payload.sections));

  @Effect() resetForm$ = this.actions$
    .ofType(SubmissionObjectActionTypes.RESET_SUBMISSION_FORM)
    .do((action: ResetSubmissionFormAction) => this.sectionService.removeAllSections(action.payload.submissionId))
    .map((action: ResetSubmissionFormAction) =>
      new LoadSubmissionFormAction(action.payload.collectionId, action.payload.submissionId, action.payload.sections));

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
      return this.submissionRestService.jsonPatchByResourceType(action.payload.submissionId, 'sections')
        .map((response) => {
          const mappedActions = [];
          if (isNotEmpty(response)) {
            const errorsList = {};

            // to avoid dispatching an action for every error, create an array of errors per section
            (response as WorkspaceitemObject[]).forEach((item: WorkspaceitemObject) => {

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
                    mappedActions.push(new UpdateSectionDataAction(action.payload.submissionId, sectionId, sections[sectionId], sectionErrors));
                  })
              }
            });
          }
          mappedActions.push(new CompleteSaveSubmissionFormAction(action.payload.submissionId));
          return mappedActions;
        });
    })
    .mergeMap((actions) => {
      return Observable.from(actions);
    });

  constructor(private actions$: Actions,
              private sectionService: SectionService,
              private submissionRestService: SubmissionRestService,
              private submissionService: SubmissionService) {}
}
