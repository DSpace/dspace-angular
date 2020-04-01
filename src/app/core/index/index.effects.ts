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
import { IndexName } from './index.reducer';
import { RestRequestMethod } from '../data/rest-request-method';
import { getUrlWithoutEmbedParams } from './index.selectors';

@Injectable()
export class UUIDIndexEffects {

  @Effect() addObject$ = this.actions$
    .pipe(
      ofType(ObjectCacheActionTypes.ADD),
      filter((action: AddToObjectCacheAction) => hasValue(action.payload.objectToCache.uuid)),
      map((action: AddToObjectCacheAction) => {
        return new AddToIndexAction(
          IndexName.OBJECT,
          action.payload.objectToCache.uuid,
          action.payload.objectToCache._links.self.href
        );
      })
    );

  @Effect() removeObject$ = this.actions$
    .pipe(
      ofType(ObjectCacheActionTypes.REMOVE),
      map((action: RemoveFromObjectCacheAction) => {
        return new RemoveFromIndexByValueAction(
          IndexName.OBJECT,
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
          IndexName.REQUEST,
          getUrlWithoutEmbedParams(action.payload.href),
          action.payload.uuid
        );
      })
    );

  constructor(private actions$: Actions) {

  }

}
