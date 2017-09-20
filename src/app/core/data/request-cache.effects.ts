import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';

import { ResetResponseCacheTimestampsAction } from '../cache/response-cache.actions';
import { StoreActionTypes } from '../../store.actions';

@Injectable()
export class RequestCacheEffects {

  /**
   * When the store is rehydrated in the browser, set all cache
   * timestamps to 'now', because the time zone of the server can
   * differ from the client.
   *
   * This assumes that the server cached everything a negligible
   * time ago, and will likely need to be revisited later
   */
  @Effect() fixTimestampsOnRehydrate = this.actions$
    .ofType(StoreActionTypes.REHYDRATE)
    .map(() => new ResetResponseCacheTimestampsAction(new Date().getTime()));

  constructor(private actions$: Actions, ) { }

}
