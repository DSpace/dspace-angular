import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects'

import {
  SubmissionDefinitionActionTypes, CompleteInitAction,
  InitDefinitionsAction, RetrieveDefinitionsAction
} from './submission-definitions.actions'
import { PanelService } from '../panel/panel.service';

@Injectable()
export class SubmissionDefinitionEffects {

  @Effect() init$ = this.actions$
    .ofType(SubmissionDefinitionActionTypes.INIT_DEFINITIONS)
    .map((action: InitDefinitionsAction) => new RetrieveDefinitionsAction());

  @Effect() retrieve$ = this.actions$
    .ofType(SubmissionDefinitionActionTypes.RETRIEVE_DEFINITIONS)
    .do(() => {
      this.panelService.retrieveDefinitions();
    })
    .map(() => new CompleteInitAction());

  constructor(private actions$: Actions, private panelService: PanelService) {}
}
