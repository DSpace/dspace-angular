import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';

import {
  ObjectCacheActionTypes, AddToObjectCacheAction,
  RemoveFromObjectCacheAction
} from '../cache/object-cache.actions';
import { AddToUUIDIndexAction, RemoveHrefFromUUIDIndexAction } from './uuid-index.actions';
import { hasValue } from '../../shared/empty.util';
import { UniversalService } from '../../universal.service';

@Injectable()
export class UUIDIndexEffects {

  @Effect() add$ = this.actions$
    .ofType(ObjectCacheActionTypes.ADD)
    .filter(() => !this.universalService.isReplaying)
    .filter((action: AddToObjectCacheAction) => hasValue(action.payload.objectToCache.uuid))
    .map((action: AddToObjectCacheAction) => {
      return new AddToUUIDIndexAction(
        action.payload.objectToCache.uuid,
        action.payload.objectToCache.self
      );
    });

  @Effect() remove$ = this.actions$
    .ofType(ObjectCacheActionTypes.REMOVE)
    .filter(() => !this.universalService.isReplaying)
    .map((action: RemoveFromObjectCacheAction) => {
      return new RemoveHrefFromUUIDIndexAction(action.payload);
    });

  constructor(
    private actions$: Actions,
    private universalService: UniversalService
  ) {

  }

}
