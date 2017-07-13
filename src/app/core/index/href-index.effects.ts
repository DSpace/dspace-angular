import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';

import {
  ObjectCacheActionTypes, AddToObjectCacheAction,
  RemoveFromObjectCacheAction
} from '../cache/object-cache.actions';
import { AddToHrefIndexAction, RemoveUUIDFromHrefIndexAction } from './href-index.actions';
import { hasValue } from '../../shared/empty.util';

@Injectable()
export class HrefIndexEffects {

  @Effect() add$ = this.actions$
    .ofType(ObjectCacheActionTypes.ADD)
    .filter((action: AddToObjectCacheAction) => hasValue(action.payload.objectToCache.self))
    .map((action: AddToObjectCacheAction) => {
      return new AddToHrefIndexAction(
        action.payload.objectToCache.self,
        action.payload.objectToCache.uuid
      );
    });

  @Effect() remove$ = this.actions$
    .ofType(ObjectCacheActionTypes.REMOVE)
    .map((action: RemoveFromObjectCacheAction) => {
      return new RemoveUUIDFromHrefIndexAction(action.payload);
    });

  constructor(private actions$: Actions) {

  }

}
