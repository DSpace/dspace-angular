import { delay, exhaustMap, first, map, switchMap } from 'rxjs/operators';
import { Inject, Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import {
  AddToSSBAction,
  CommitSSBAction,
  EmptySSBAction,
  ServerSyncBufferActionTypes
} from './server-sync-buffer.actions';
import { GLOBAL_CONFIG } from '../../../config';
import { GlobalConfig } from '../../../config/global-config.interface';
import { coreSelector, CoreState } from '../core.reducers';
import { Action, createSelector, MemoizedSelector, select, Store } from '@ngrx/store';
import { ServerSyncBufferEntry, ServerSyncBufferState } from './server-sync-buffer.reducer';
import { combineLatest as observableCombineLatest, of as observableOf } from 'rxjs';
import { RequestService } from '../data/request.service';
import { PutRequest } from '../data/request.models';
import { ObjectCacheService } from './object-cache.service';
import { ApplyPatchObjectCacheAction } from './object-cache.actions';
import { DSpaceRESTv2Serializer } from '../dspace-rest-v2/dspace-rest-v2.serializer';
import { GenericConstructor } from '../shared/generic-constructor';
import { hasValue, isNotEmpty, isNotUndefined } from '../../shared/empty.util';
import { Observable } from 'rxjs/internal/Observable';
import { RestRequestMethod } from '../data/rest-request-method';

@Injectable()
export class ServerSyncBufferEffects {
  @Effect() setTimeoutForServerSync = this.actions$
    .pipe(
      ofType(ServerSyncBufferActionTypes.ADD),
      exhaustMap((action: AddToSSBAction) => {
        const autoSyncConfig = this.EnvConfig.cache.autoSync;
        const timeoutInSeconds = autoSyncConfig.timePerMethod[action.payload.method] || autoSyncConfig.defaultTime;
        return observableOf(new CommitSSBAction(action.payload.method)).pipe(delay(timeoutInSeconds * 1000))
      })
    );

  @Effect() commitServerSyncBuffer = this.actions$
    .pipe(
      ofType(ServerSyncBufferActionTypes.COMMIT),
      switchMap((action: CommitSSBAction) => {
        return this.store.pipe(
          select(serverSyncBufferSelector()),
          switchMap((bufferState: ServerSyncBufferState) => {
            const actions: Array<Observable<Action>> = bufferState.buffer
              .filter((entry: ServerSyncBufferEntry) => {
                /* If there's a request method, filter
                 If there's no filter, commit everything */
                if (hasValue(action.payload)) {
                  return entry.method === action.payload;
                }
                return true;
              })
              .map((entry: ServerSyncBufferEntry) => {
                if (entry.method === RestRequestMethod.PATCH) {
                  return this.applyPatch(entry.href);
                } else {
                  /* TODO other request stuff */
                }
              });

            /* Add extra action to array, to make sure the ServerSyncBuffer is emptied afterwards */
            if (isNotEmpty(actions) && isNotUndefined(actions[0])) {
              return observableCombineLatest(...actions).pipe(
              switchMap((array) => [...array, new EmptySSBAction(action.payload)])
            );
            } else {
              return observableOf({ type: 'NO_ACTION' });
            }
          })
        )
      })
    );

  private applyPatch(href: string): Observable<Action> {
    const patchObject = this.objectCache.getBySelfLink(href).pipe(first());

    return patchObject.pipe(
      map((object) => {
        const serializedObject = new DSpaceRESTv2Serializer(object.constructor as GenericConstructor<{}>).serialize(object);

        this.requestService.configure(new PutRequest(this.requestService.generateRequestId(), href, serializedObject));

        return new ApplyPatchObjectCacheAction(href)
      })
    )
  }

  constructor(private actions$: Actions,
              private store: Store<CoreState>,
              private requestService: RequestService,
              private objectCache: ObjectCacheService,
              @Inject(GLOBAL_CONFIG) private EnvConfig: GlobalConfig) {

  }
}

export function serverSyncBufferSelector(): MemoizedSelector<CoreState, ServerSyncBufferState> {
  return createSelector(coreSelector, (state: CoreState) => state['cache/syncbuffer']);
}
