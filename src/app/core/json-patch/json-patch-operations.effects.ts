import { Injectable } from '@angular/core';
import {
  Actions,
  createEffect,
  ofType,
} from '@ngrx/effects';
import { map } from 'rxjs/operators';

import {
  CommitPatchOperationsAction,
  FlushPatchOperationsAction,
  JsonPatchOperationsActionTypes,
} from './json-patch-operations.actions';

/**
 * Provides effect methods for jsonPatch Operations actions
 */
@Injectable()
export class JsonPatchOperationsEffects {

  /**
   * Dispatches a FlushPatchOperationsAction for every dispatched CommitPatchOperationsAction
   */
  commit$ = createEffect(() => this.actions$.pipe(
    ofType(JsonPatchOperationsActionTypes.COMMIT_JSON_PATCH_OPERATIONS),
    map((action: CommitPatchOperationsAction) => {
      return new FlushPatchOperationsAction(action.payload.resourceType, action.payload.resourceId);
    })));

  constructor(private actions$: Actions) {}

}
