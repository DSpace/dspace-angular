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
import { Observable } from 'rxjs';
import {
  map,
  switchMap,
} from 'rxjs/operators';

import { getPageNotFoundRoute } from '../app-routing-paths';
import { ItemDataService } from '../core/data/item-data.service';
import { PaginatedList } from '../core/data/paginated-list.model';
import { RemoteData } from '../core/data/remote-data';
import { CrisLayoutTab } from '../core/layout/models/tab.model';
import { TabDataService } from '../core/layout/tab-data.service';
import { HardRedirectService } from '../core/services/hard-redirect.service';
import { Item } from '../core/shared/item.model';
import { getFirstCompletedRemoteData } from '../core/shared/operators';
import { createFailedRemoteDataObject$ } from '../shared/remote-data.utils';
import { getItemPageRoute } from './item-page-routing-paths';

/**
 * Method for resolving the tabs of item based on the parameters in the current route
 * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
 * @param {RouterStateSnapshot} state The current RouterStateSnapshot
 * @returns Observable<<RemoteData<Item>> Emits the found item based on the parameters in the current route,
 * or an error if something went wrong
 */
export const crisItemPageTabResolver: ResolveFn<RemoteData<PaginatedList<CrisLayoutTab>>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): Observable<RemoteData<PaginatedList<CrisLayoutTab>>> => {
  const platformId = inject(PLATFORM_ID);
  const hardRedirectService = inject(HardRedirectService);
  const tabService = inject(TabDataService);
  const itemDataService = inject(ItemDataService);
  const router = inject(Router);

  return itemDataService.findById(route.params.id).pipe(
    getFirstCompletedRemoteData(),
    switchMap((itemRD: RemoteData<Item>) => {
      if (itemRD.hasSucceeded && itemRD.statusCode === 200) {
        return tabService.findByItem(
          itemRD.payload.uuid,
          true,
          true,
        ).pipe(
          getFirstCompletedRemoteData(),
          map((tabsRD: RemoteData<PaginatedList<CrisLayoutTab>>) => {
            if (tabsRD.hasSucceeded && tabsRD?.payload?.page?.length > 0) {
              // By splitting the url with uuid we can understand if the item is primary item page or a tab
              const urlSplit = state.url.split(route.params.id);
              const givenTab = urlSplit[1];
              const itemPageRoute = getItemPageRoute(itemRD.payload);

              const isValidTab = !givenTab || tabsRD.payload.page.some((tab) => {
                const shortnameSplit = tab.shortname.split('::');
                const shortname = shortnameSplit[shortnameSplit.length - 1];
                return `/${shortname}` === givenTab;
              });

              const mainTab = tabsRD.payload.page.length === 1
                ? tabsRD.payload.page[0]
                : tabsRD.payload.page.find(tab => !tab.leading);

              if (!isValidTab) {
                // If wrong tab is given redirect to 404 page
                router.navigateByUrl(getPageNotFoundRoute(), { skipLocationChange: true, replaceUrl: false });
              } else if (givenTab === `/${mainTab.shortname}`) {
                if (isPlatformServer(platformId)) {
                  // If first tab is given redirect to root item page
                  hardRedirectService.redirect(itemPageRoute, 302);
                } else {
                  router.navigateByUrl(itemPageRoute);
                }
              }
            }
            return tabsRD;
          }),
        );
      } else {
        return createFailedRemoteDataObject$<PaginatedList<CrisLayoutTab>>(itemRD?.errorMessage, itemRD?.statusCode, itemRD?.timeCompleted);
      }
    }),
  );
};
