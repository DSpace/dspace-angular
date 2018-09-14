import { delay, exhaustMap, filter, first, map } from 'rxjs/operators';
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
import { select, Store } from '@ngrx/store';
import { ServerSyncBufferEntry, ServerSyncBufferState } from './server-sync-buffer.reducer';
import { of as observableOf } from 'rxjs';
import { RequestService } from '../data/request.service';
import { PutRequest } from '../data/request.models';

@Injectable()
export class ObjectCacheEffects {
  @Effect() setTimeoutForServerSync = this.actions$
    .pipe(ofType(ServerSyncBufferActionTypes.ADD),
      exhaustMap((action: AddToSSBAction) => {
        const autoSyncConfig = this.EnvConfig.cache.autoSync;
        const timeoutInSeconds = autoSyncConfig.timePerMethod[action.type] || autoSyncConfig.defaultTime;
        return observableOf(new CommitSSBAction(action.payload.method)).pipe(delay( timeoutInSeconds * 1000))
      })
    );

  @Effect() commitServerSyncBuffer = this.actions$
    .pipe(ofType(ServerSyncBufferActionTypes.COMMIT),
      map((action: CommitSSBAction) => {
        this.store.pipe(
          select(serverSyncBufferSelector),
          first()
        ).subscribe((bufferState: ServerSyncBufferState) => {
            bufferState.buffer
            .filter((entry: ServerSyncBufferEntry) => entry.method === action.payload)
            .forEach((entry: ServerSyncBufferEntry) => {
              this.requestService.configure(new PutRequest(this.requestService.generateRequestId(), ,))
            })
        });
        return new EmptySSBAction(action.payload);
      })
    );

  constructor(private actions$: Actions,
              private store: Store<CoreState>,
              private requestService: RequestService,
              @Inject(GLOBAL_CONFIG) private EnvConfig: GlobalConfig) {

  }
}

export const serverSyncBufferSelector = (state: CoreState) => state['cache/syncbuffer'];
