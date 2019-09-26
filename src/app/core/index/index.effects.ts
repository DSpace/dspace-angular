import { filter, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import {
  AddToObjectCacheAction,
  ObjectCacheActionTypes,
  RemoveFromObjectCacheAction
} from '../cache/object-cache.actions';
import { RequestActionTypes, RequestConfigureAction } from '../data/request.actions';
import { AddToIndexAction, RemoveFromIndexByValueAction } from './index.actions';
import { hasValue } from '../../shared/empty.util';
import { getIdentiferByIndexName, IdentifierType, REQUEST } from './index.reducer';
import { RestRequestMethod } from '../data/rest-request-method';

@Injectable()
export class IdentifierIndexEffects {

  @Effect() addObjectByUUID$ = this.actions$
    .pipe(
      ofType(ObjectCacheActionTypes.ADD),
      filter((action: AddToObjectCacheAction) => hasValue(action.payload.objectToCache.uuid)),
      map((action: AddToObjectCacheAction) => {
        return new AddToIndexAction(
          getIdentiferByIndexName(IdentifierType.UUID),
          action.payload.objectToCache.uuid,
          action.payload.objectToCache.self
        );
      })
    );

  @Effect() addObjectByHandle$ = this.actions$
    .pipe(
      ofType(ObjectCacheActionTypes.ADD),
      filter((action: AddToObjectCacheAction) => hasValue(action.payload.objectToCache.handle)),
      map((action: AddToObjectCacheAction) => {
        return new AddToIndexAction(
          getIdentiferByIndexName(IdentifierType.HANDLE),
          action.payload.objectToCache.handle,
          action.payload.objectToCache.self
        );
      })
    );

  @Effect() removeObjectByUUID$ = this.actions$
    .pipe(
      ofType(ObjectCacheActionTypes.REMOVE),
      map((action: RemoveFromObjectCacheAction) => {
        return new RemoveFromIndexByValueAction(
          getIdentiferByIndexName(IdentifierType.UUID),
          action.payload
        );
      })
    );

  @Effect() removeObjectByHandle$ = this.actions$
    .pipe(
      ofType(ObjectCacheActionTypes.REMOVE),
      map((action: RemoveFromObjectCacheAction) => {
        return new RemoveFromIndexByValueAction(
          getIdentiferByIndexName(IdentifierType.HANDLE),
            action.payload
          );
      })
    );

  @Effect() addRequest$ = this.actions$
    .pipe(
      ofType(RequestActionTypes.CONFIGURE),
      filter((action: RequestConfigureAction) => action.payload.method === RestRequestMethod.GET),
      map((action: RequestConfigureAction) => {
        return new AddToIndexAction(
          REQUEST,
          action.payload.href,
          action.payload.uuid
        );
      })
    );

  constructor(private actions$: Actions) {

  }

}
