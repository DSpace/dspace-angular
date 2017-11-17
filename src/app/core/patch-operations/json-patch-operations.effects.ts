import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';

import {
  CommitPatchOperationsAction, FlushPatchOperationsAction,
  JsonPatchOperationsActionTypes
} from './json-patch-operations.actions';

@Injectable()
export class JsonPatchOperationsEffects {

  @Effect() commit$ = this.actions$
    .ofType(JsonPatchOperationsActionTypes.COMMIT_JSON_PATCH_OPERATIONS)
    .map((action: CommitPatchOperationsAction) => {
      return new FlushPatchOperationsAction(action.payload.namespace);
    });

  constructor(private actions$: Actions) {}

}
