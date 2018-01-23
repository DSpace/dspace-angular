import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';

import {
  ObjectCacheActionTypes, AddToObjectCacheAction,
  RemoveFromObjectCacheAction
} from '../cache/object-cache.actions';
import { RequestActionTypes, RequestConfigureAction } from '../data/request.actions';
import { RestRequestMethod } from '../data/request.models';
import { AddToIndexAction, RemoveFromIndexByValueAction } from './index.actions';
import { hasValue } from '../../shared/empty.util';
import { IndexName } from './index.reducer';

@Injectable()
export class UUIDIndexEffects {

  @Effect() addObject$ = this.actions$
    .ofType(ObjectCacheActionTypes.ADD)
    .filter((action: AddToObjectCacheAction) => hasValue(action.payload.objectToCache.uuid))
    .map((action: AddToObjectCacheAction) => {
      return new AddToIndexAction(
        IndexName.OBJECT,
        action.payload.objectToCache.uuid,
        action.payload.objectToCache.self
      );
    });

  @Effect() removeObject$ = this.actions$
    .ofType(ObjectCacheActionTypes.REMOVE)
    .map((action: RemoveFromObjectCacheAction) => {
      return new RemoveFromIndexByValueAction(
        IndexName.OBJECT,
        action.payload
      );
    });

  @Effect() addRequest$ = this.actions$
    .ofType(RequestActionTypes.CONFIGURE)
    .filter((action: RequestConfigureAction) => action.payload.method === RestRequestMethod.Get)
    .map((action: RequestConfigureAction) => {
      return new AddToIndexAction(
        IndexName.REQUEST,
        action.payload.href,
        action.payload.uuid
      );
    });

  // @Effect() removeRequest$ = this.actions$
  //   .ofType(ObjectCacheActionTypes.REMOVE)
  //   .map((action: RemoveFromObjectCacheAction) => {
  //     return new RemoveFromIndexByValueAction(
  //       IndexName.OBJECT,
  //       action.payload
  //     );
  //   });

  constructor(private actions$: Actions) {

  }

}
