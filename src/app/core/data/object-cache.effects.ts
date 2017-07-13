import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';

import { StoreActionTypes } from '../../store.actions';
import { ResetObjectCacheTimestampsAction } from '../cache/object-cache.actions';

@Injectable()
export class ObjectCacheEffects {

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
    .map(() => new ResetObjectCacheTimestampsAction(new Date().getTime()));

  constructor(private actions$: Actions) { }

}
