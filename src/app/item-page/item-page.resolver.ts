import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router, RouterStateSnapshot } from '@angular/router';
import {
  AuthService,
  ItemDataService,
  RemoteData,
  ResolvedAction,
  getItemPageRoute,
  redirectOn4xx,
  getItemPageLinksToFollow,
  Item,
  getFirstCompletedRemoteData,
} from '@dspace/core'
import { APP_CONFIG, AppConfig } from '@dspace/config';
import { hasValue } from '@dspace/utils';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AppState } from '../app.reducer';

/**
 * Method for resolving an item based on the parameters in the current route
 * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
 * @param {RouterStateSnapshot} state The current RouterStateSnapshot
 * @param {Router} router
 * @param {ItemDataService} itemService
 * @param {Store<AppState>} store
 * @param {AuthService} authService
 * @returns Observable<<RemoteData<Item>> Emits the found item based on the parameters in the current route,
 * or an error if something went wrong
 */
export const itemPageResolver: ResolveFn<RemoteData<Item>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  router: Router = inject(Router),
  itemService: ItemDataService = inject(ItemDataService),
  store: Store<AppState> = inject(Store<AppState>),
  authService: AuthService = inject(AuthService),
  appConfig: AppConfig = inject(APP_CONFIG),
): Observable<RemoteData<Item>> => {
  const itemRD$ = itemService.findById(
    route.params.id,
    true,
    false,
    ...getItemPageLinksToFollow(appConfig.item.showAccessStatuses),
  ).pipe(
    getFirstCompletedRemoteData(),
    redirectOn4xx(router, authService),
  );

  itemRD$.subscribe((itemRD: RemoteData<Item>) => {
    store.dispatch(new ResolvedAction(state.url, itemRD.payload));
  });

  return itemRD$.pipe(
    map((rd: RemoteData<Item>) => {
      if (rd.hasSucceeded && hasValue(rd.payload)) {
        const thisRoute = state.url;

        // Angular uses a custom function for encodeURIComponent, (e.g. it doesn't encode commas
        // or semicolons) and thisRoute has been encoded with that function. If we want to compare
        // it with itemRoute, we have to run itemRoute through Angular's version as well to ensure
        // the same characters are encoded the same way.
        const itemRoute = router.parseUrl(getItemPageRoute(rd.payload)).toString();

        if (!thisRoute.startsWith(itemRoute)) {
          const itemId = rd.payload.uuid;
          const subRoute = thisRoute.substring(thisRoute.indexOf(itemId) + itemId.length, thisRoute.length);
          void router.navigateByUrl(itemRoute + subRoute);
        }
      }
      return rd;
    }),
  );
};
