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
import { AuthService } from '@dspace/core/auth/auth.service';
import { ItemDataService } from '@dspace/core/data/item-data.service';
import { RemoteData } from '@dspace/core/data/remote-data';
import { ResolvedAction } from '@dspace/core/resolving/resolver.actions';
import { getItemPageRoute } from '@dspace/core/router/utils/dso-route.utils';
import { HardRedirectService } from '@dspace/core/services/hard-redirect.service';
import { redirectOn4xx } from '@dspace/core/shared/authorized.operators';
import {
  getItemPageLinksToFollow,
  Item,
} from '@dspace/core/shared/item.model';
import { getFirstCompletedRemoteData } from '@dspace/core/shared/operators';
import { hasValue } from '@dspace/shared/utils/empty.util';
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
  platformId: any = inject(PLATFORM_ID),
  hardRedirectService: HardRedirectService = inject(HardRedirectService),
): Observable<RemoteData<Item>> => {
  const itemRD$ = itemService.findByIdOrCustomUrl(
    route.params.id,
    true,
    false,
    ...getItemPageLinksToFollow(),
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
        let itemRoute;
        if (hasValue(rd.payload.metadata) && rd.payload.hasMetadata('dspace.customurl')) {
          const customUrl = rd.payload.firstMetadataValue('dspace.customurl');
          const isSubPath = !(state.url.endsWith(customUrl) || state.url.endsWith(rd.payload.id) || state.url.endsWith('/full'));
          itemRoute = isSubPath ? state.url : router.parseUrl(getItemPageRoute(rd.payload)).toString();
          let newUrl: string;
          if (route.params.id !== customUrl && !isSubPath) {
            newUrl = itemRoute.replace(route.params.id,rd.payload.firstMetadataValue('dspace.customurl'));
          } else if (isSubPath && route.params.id === customUrl) {
            // In case of a sub path, we need to ensure we navigate to the edit page of the item ID, not the custom URL
            const itemId = rd.payload.uuid;
            newUrl = itemRoute.replace(rd.payload.firstMetadataValue('dspace.customurl'), itemId);
          }

          if (hasValue(newUrl)) {
            router.navigateByUrl(newUrl);
          }
        } else  {
          const thisRoute = state.url;

          // Angular uses a custom function for encodeURIComponent, (e.g. it doesn't encode commas
          // or semicolons) and thisRoute has been encoded with that function. If we want to compare
          // it with itemRoute, we have to run itemRoute through Angular's version as well to ensure
          // the same characters are encoded the same way.
          itemRoute = router.parseUrl(getItemPageRoute(rd.payload)).toString();

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
