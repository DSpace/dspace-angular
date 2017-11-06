import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects'

import {
  NewSubmissionFormAction, InitSubmissionFormAction, SubmissionObjectActionTypes,
  CompleteInitSubmissionFormAction
} from './submission-objects.actions';
import { SectionService } from '../section/section.service';

@Injectable()
export class SubmissionObjectEffects {

  @Effect() new$ = this.actions$
    .ofType(SubmissionObjectActionTypes.NEW)
    .map((action: NewSubmissionFormAction) =>
      new InitSubmissionFormAction(action.payload.collectionId, action.payload.definitionId, action.payload.submissionId));

  @Effect() initForm$ = this.actions$
    .ofType(SubmissionObjectActionTypes.INIT_SUBMISSION_FORM)
    .do((action: InitSubmissionFormAction) => {
      this.sectionService.loadDefaultSections(action.payload.collectionId, action.payload.submissionId, action.payload.definitionId);
    })
    .map(() => new CompleteInitSubmissionFormAction());

  constructor(private actions$: Actions, private sectionService: SectionService) {}
}
