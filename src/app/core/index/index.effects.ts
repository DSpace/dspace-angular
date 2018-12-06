import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { filter, map } from 'rxjs/operators';

import { AddToIndexAction, RemoveFromIndexByValueAction } from './index.actions';
import { IndexName } from './index.reducer';
import { hasValue } from '../../shared/empty.util';
import { AddToObjectCacheAction, ObjectCacheActionTypes, RemoveFromObjectCacheAction } from '../cache/object-cache.actions';
import { RequestActionTypes, RequestConfigureAction } from '../data/request.actions';
import { RestRequestMethod } from '../data/request.models';

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
          action.payload.objectToCache.self
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
      filter((action: RequestConfigureAction) => action.payload.method === RestRequestMethod.Get),
      map((action: RequestConfigureAction) => {
        return new AddToIndexAction(
          IndexName.REQUEST,
          action.payload.href,
          action.payload.uuid
        );
      })
    );

  // @Effect() removeRequest$ = this.actions$
  //   .pipe(
  //    ofType(ObjectCacheActionTypes.REMOVE),
  //    map((action: RemoveFromObjectCacheAction) => {
  //     return new RemoveFromIndexByValueAction(
  //       IndexName.OBJECT,
  //       action.payload
  //     );
  //   })
  // )

  constructor(private actions$: Actions) {

  }

}
