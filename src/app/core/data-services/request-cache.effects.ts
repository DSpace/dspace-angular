import { Injectable } from "@angular/core";
import { Actions, Effect } from "@ngrx/effects";
import { ResetRequestCacheTimestampsAction } from "../cache/request-cache.actions";
import { Store } from "@ngrx/store";
import { RequestCacheState } from "../cache/request-cache.reducer";
import { ObjectCacheActionTypes } from "../cache/object-cache.actions";

@Injectable()
export class RequestCacheEffects {

  constructor(
    private actions$: Actions,
    private store: Store<RequestCacheState>
  ) { }

  /**
   * When the store is rehydrated in the browser, set all cache
   * timestamps to "now", because the time zone of the server can
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
    .map(() => new ResetRequestCacheTimestampsAction(new Date().getTime()));

}
