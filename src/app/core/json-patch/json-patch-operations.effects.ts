import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';
import { Effect, Actions, ofType } from '@ngrx/effects';

import {
  CommitPatchOperationsAction, FlushPatchOperationsAction,
  JsonPatchOperationsActionTypes
} from './json-patch-operations.actions';

@Injectable()
export class JsonPatchOperationsEffects {

  @Effect() commit$ = this.actions$.pipe(
    ofType(JsonPatchOperationsActionTypes.COMMIT_JSON_PATCH_OPERATIONS),
    map((action: CommitPatchOperationsAction) => {
      return new FlushPatchOperationsAction(action.payload.resourceType, action.payload.resourceId);
    }));

  constructor(private actions$: Actions) {}

}
