import { isPlatformServer } from '@angular/common';
import {
  inject,
  PLATFORM_ID,
} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AppState } from '../app.reducer';
import { AuthService } from '../core/auth/auth.service';
import { ItemDataService } from '../core/data/item-data.service';
import { RemoteData } from '../core/data/remote-data';
import { ResolvedAction } from '../core/resolving/resolver.actions';
import { HardRedirectService } from '../core/services/hard-redirect.service';
import {
  redirectOn4xx,
  redirectOn204,
} from '../core/shared/authorized.operators';
import { Item } from '../core/shared/item.model';
import { getFirstCompletedRemoteData } from '../core/shared/operators';
import {
  hasValue,
  isNotEmpty,
} from '../shared/empty.util';
import { ITEM_PAGE_LINKS_TO_FOLLOW } from './item.resolver';
import { getItemPageRoute } from './item-page-routing-paths';

/**
 * Method for resolving an item based on the parameters in the current route
 * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
 * @param {RouterStateSnapshot} state The current RouterStateSnapshot
 * @param {Router} router
 * @param {ItemDataService} itemService
 * @param {Store<AppState>} store
 * @param {AuthService} authService
 * @param platformId
 * @param hardRedirectService
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
  platformId: any = inject(PLATFORM_ID),
  hardRedirectService: HardRedirectService = inject(HardRedirectService),
): Observable<RemoteData<Item>> => {
  return itemService.findById(
    route.params.id,
    false,
    true,
    ...ITEM_PAGE_LINKS_TO_FOLLOW,
  ).pipe(
    getFirstCompletedRemoteData(),
    redirectOn204<Item>(router, authService),
    redirectOn4xx(router, authService),
    map((rd: RemoteData<Item>) => {
      store.dispatch(new ResolvedAction(state.url, rd.payload));
      if (rd.hasSucceeded && hasValue(rd.payload)) {
        // Check if custom url not empty and if the current id parameter is different from the custom url redirect to custom url
        if (hasValue(rd.payload.metadata) && isNotEmpty(rd.payload.metadata['cris.customurl'])) {
          if (route.params.id !== rd.payload.metadata['cris.customurl'][0].value) {
            const newUrl = state.url.replace(route.params.id, rd.payload.metadata['cris.customurl'][0].value);
            router.navigateByUrl(newUrl);
          }
        } else {
          const thisRoute = state.url;

          // Angular uses a custom function for encodeURIComponent, (e.g. it doesn't encode commas
          // or semicolons) and thisRoute has been encoded with that function. If we want to compare
          // it with itemRoute, we have to run itemRoute through Angular's version as well to ensure
          // the same characters are encoded the same way.
          const itemRoute = router.parseUrl(getItemPageRoute(rd.payload)).toString();

          if (!thisRoute.startsWith(itemRoute)) {
            const itemId = rd.payload.uuid;
            const subRoute = thisRoute.substring(thisRoute.indexOf(itemId) + itemId.length, thisRoute.length);
            if (isPlatformServer(platformId)) {
              hardRedirectService.redirect(itemRoute + subRoute, 301);
            } else {
              router.navigateByUrl(itemRoute + subRoute);
            }
          }
        }
      }
      return rd;
    }),
  );
};
