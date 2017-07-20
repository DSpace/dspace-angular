import { Injectable, Inject } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';

import { ObjectCacheActionTypes } from '../cache/object-cache.actions';
import { ResetResponseCacheTimestampsAction } from '../cache/response-cache.actions';

@Injectable()
export class RequestCacheEffects {

  /**
   * When the store is rehydrated in the browser, set all cache
   * timestamps to 'now', because the time zone of the server can
   * differ from the client.
   *
   * This assumes that the server cached everything a negligible
   * time ago, and will likely need to be revisited later
   *
   * This effect should listen for StoreActionTypes.REHYDRATE,
   * but can't because you can only have one effect listen to
   * an action atm. Github issue:
   * https://github.com/ngrx/effects/issues/87
   *
   * It's listening for ObjectCacheActionTypes.RESET_TIMESTAMPS
   * instead, until there's a solution.
   */
  @Effect() fixTimestampsOnRehydrate = this.actions$
    .ofType(ObjectCacheActionTypes.RESET_TIMESTAMPS)
    .map(() => new ResetResponseCacheTimestampsAction(new Date().getTime()));

  constructor(private actions$: Actions, ) { }

}
