import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects'

import {
  NewSubmissionFormAction, InitSubmissionFormAction, SubmissionObjectActionTypes,
  CompleteInitSubmissionFormAction
} from './submission-objects.actions';
import { PanelService } from '../panel/panel.service';

@Injectable()
export class SubmissionObjectEffects {

  @Effect() new$ = this.actions$
    .ofType(SubmissionObjectActionTypes.NEW)
    .map((action: NewSubmissionFormAction) => new InitSubmissionFormAction(action.payload.submissionId, action.payload.definitionId));

  @Effect() initForm$ = this.actions$
    .ofType(SubmissionObjectActionTypes.INIT_SUBMISSION_FORM)
    .do((action: InitSubmissionFormAction) => {
      this.panelService.loadDefaultPanels(action.payload.submissionId, action.payload.definitionId);
    })
    .map(() => new CompleteInitSubmissionFormAction());

  constructor(private actions$: Actions, private panelService: PanelService) {}
}
