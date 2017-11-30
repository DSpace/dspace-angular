import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects'

import {
  NewSubmissionFormAction, InitSubmissionFormAction, SubmissionObjectActionTypes,
  CompleteInitSubmissionFormAction
} from './submission-objects.actions';
import { SectionService } from '../section/section.service';
import { InitDefaultDefinitionAction } from '../definitions/submission-definitions.actions';

@Injectable()
export class SubmissionObjectEffects {

  @Effect() new$ = this.actions$
    .ofType(SubmissionObjectActionTypes.NEW)
    .map((action: NewSubmissionFormAction) =>
      new InitDefaultDefinitionAction(action.payload.collectionId, action.payload.submissionId, action.payload.sections));

  @Effect() initForm$ = this.actions$
    .ofType(SubmissionObjectActionTypes.INIT_SUBMISSION_FORM)
    .do((action: InitSubmissionFormAction) => {
      this.sectionService.loadDefaultSections(action.payload.collectionId,
                                              action.payload.submissionId,
                                              action.payload.definitionId,
                                              action.payload.sections);
    })
    .map((action: InitSubmissionFormAction) => new CompleteInitSubmissionFormAction(action.payload.submissionId));

  constructor(private actions$: Actions, private sectionService: SectionService) {}
}
