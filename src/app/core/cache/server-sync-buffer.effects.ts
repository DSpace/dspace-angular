import { delay, exhaustMap, first, map, switchMap, tap } from 'rxjs/operators';
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
import { CoreState } from '../core.reducers';
import { Action, select, Store } from '@ngrx/store';
import { ServerSyncBufferEntry, ServerSyncBufferState } from './server-sync-buffer.reducer';
import { of as observableOf, combineLatest as observableCombineLatest } from 'rxjs';
import { RequestService } from '../data/request.service';
import { PutRequest } from '../data/request.models';
import { ObjectCacheService } from './object-cache.service';
import { ApplyPatchObjectCacheAction } from './object-cache.actions';
import { DSpaceRESTv2Serializer } from '../dspace-rest-v2/dspace-rest-v2.serializer';
import { GenericConstructor } from '../shared/generic-constructor';
import { hasValue } from '../../shared/empty.util';
import { Observable } from 'rxjs/internal/Observable';
import { RestRequestMethod } from '../data/rest-request-method';

@Injectable()
export class ServerSyncBufferEffects {
  @Effect() setTimeoutForServerSync = this.actions$
    .pipe(
      ofType(ServerSyncBufferActionTypes.ADD),
      exhaustMap((action: AddToSSBAction) => {
        // const autoSyncConfig = this.EnvConfig.cache.autoSync;
        // const timeoutInSeconds = autoSyncConfig.timePerMethod[action.type] || autoSyncConfig.defaultTime;
        const timeoutInSeconds = 0;
        return observableOf(new CommitSSBAction(action.payload.method)).pipe(delay(timeoutInSeconds * 1000))
      })
    );

  @Effect() commitServerSyncBuffer = this.actions$
    .pipe(
      ofType(ServerSyncBufferActionTypes.COMMIT),
      switchMap((action: CommitSSBAction) => {
        return this.store.pipe(
          select(serverSyncBufferSelector),
          map((bufferState: ServerSyncBufferState) => {
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
            return observableCombineLatest(actions).pipe(
              map((array) => array.push(new EmptySSBAction(action.payload)))
            );
          })
        )
      })
    );

  private applyPatch(href: string): Observable<Action> {
    const patchObject = this.objectCache.getBySelfLink(href);
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

export const serverSyncBufferSelector = (state: CoreState) => state['cache/syncbuffer'];
