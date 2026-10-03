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
import { NotificationOptions } from '@dspace/core/notification-system/models/notification-options.model';
import { NotificationsService } from '@dspace/core/notification-system/notifications.service';
import { ResolvedAction } from '@dspace/core/resolving/resolver.actions';
import {
  CUSTOM_URL_VALID_PATTERN,
  getItemPageRoute,
} from '@dspace/core/router/utils/dso-route.utils';
import { HardRedirectService } from '@dspace/core/services/hard-redirect.service';
import {
  redirectOn4xx,
  redirectOn204,
} from '@dspace/core/shared/authorized.operators';
import {
  getItemPageLinksToFollow,
  Item,
} from '@dspace/core/shared/item.model';
import { getFirstCompletedRemoteData } from '@dspace/core/shared/operators';
import { hasValue } from '@dspace/shared/utils/empty.util';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
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
  notificationsService: NotificationsService = inject(NotificationsService),
  translateService: TranslateService = inject(TranslateService),
): Observable<RemoteData<Item>> => {
  const itemRD$ = itemService.findByIdOrCustomUrl(
    route.params.id,
    true,
    true,
    ...getItemPageLinksToFollow(),
  ).pipe(
    getFirstCompletedRemoteData(),
    redirectOn204<Item>(router, authService),
    redirectOn4xx(router, authService),
  );

  itemRD$.subscribe((itemRD: RemoteData<Item>) => {
    store.dispatch(new ResolvedAction(state.url, itemRD.payload));
  });

  return itemRD$.pipe(
    map((rd: RemoteData<Item>) => {
      if (rd.hasSucceeded && hasValue(rd.payload)) {
        let itemRoute: string;
        if (hasValue(rd.payload.metadata) && rd.payload.hasMetadata('dspace.customurl')) {
          const customUrl = rd.payload.firstMetadataValue('dspace.customurl');
          const isValidCustomUrl = CUSTOM_URL_VALID_PATTERN.test(customUrl);

          // FIX #5479: detect navigation from edit/administer to avoid redirecting to deleted custom URL
          const isComingFromEdit = state.url.includes('/edit') || state.url.includes('/administer');

          const decodedStateUrl = decodeURIComponent(state.url);
          const isSubPath = !(decodedStateUrl.endsWith(customUrl) || decodedStateUrl.endsWith(rd.payload.id) || decodedStateUrl.endsWith('/full'));
          itemRoute = (isSubPath || !isValidCustomUrl) ? state.url : router.parseUrl(getItemPageRoute(rd.payload)).toString();

          let newUrl: string;

          if (route.params.id !== customUrl && !isSubPath) {
            // Only redirect to custom URL if NOT navigating from edit/administer page
            if (!isComingFromEdit) {
              if (isValidCustomUrl) {
                newUrl = itemRoute.replace(route.params.id, customUrl);
              } else {
                // Notify the user that custom url won't be used as it is malformed
                const notificationOptions = new NotificationOptions(-1, true);
                notificationsService.warning(
                  translateService.instant('item-page.resolver.invalid-custom-url.title'),
                  translateService.instant('item-page.resolver.invalid-custom-url.message'),
                  notificationOptions,
                );
                // Fall back to UUID route
                const type = rd.payload.firstMetadataValue('dspace.entity.type');
                newUrl = hasValue(type)
                  ? `/entities/${encodeURIComponent(type.toLowerCase())}/${rd.payload.uuid}`
                  : `/items/${rd.payload.uuid}`;
              }
            }
          } else if (isSubPath && route.params.id === customUrl) {
            // In case of a sub path, ensure we navigate to the edit page of the item ID, not the custom URL
            const itemId = rd.payload.uuid;
            newUrl = decodeURIComponent(itemRoute).replace(customUrl, itemId);
          }

          if (hasValue(newUrl)) {
            router.navigateByUrl(newUrl);
          }
        } else {
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
