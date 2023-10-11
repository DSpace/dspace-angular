import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { ItemDataService } from '../core/data/item-data.service';
import { RemoteData } from '../core/data/remote-data';
import { CrisLayoutTab } from '../core/layout/models/tab.model';
import { TabDataService } from '../core/layout/tab-data.service';
import { PaginatedList } from '../core/data/paginated-list.model';
import { getFirstCompletedRemoteData } from '../core/shared/operators';
import { Item } from '../core/shared/item.model';
import { getItemPageRoute } from './item-page-routing-paths';
import { createFailedRemoteDataObject$ } from '../shared/remote-data.utils';

/**
 * This class represents a resolver that requests the tabs of specific
 * item before the route is activated
 */
@Injectable()
export class CrisItemPageTabResolver implements Resolve<RemoteData<PaginatedList<CrisLayoutTab>>> {

  constructor(private tabService: TabDataService, private itemDataService: ItemDataService, private router: Router) { }

  /**
   * Method for resolving the tabs of item based on the parameters in the current route
   * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
   * @param {RouterStateSnapshot} state The current RouterStateSnapshot
   * @returns Observable<<RemoteData<Item>> Emits the found item based on the parameters in the current route,
   * or an error if something went wrong
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<RemoteData<PaginatedList<CrisLayoutTab>>> {
    return this.itemDataService.findById(route.params.id).pipe(
      getFirstCompletedRemoteData(),
      switchMap((itemRD: RemoteData<Item>) => {
        if (itemRD.hasSucceeded && itemRD.statusCode === 200) {
          return this.tabService.findByItem(
            itemRD.payload.uuid,
            true
          ).pipe(
            getFirstCompletedRemoteData(),
            map((tabsRD: RemoteData<PaginatedList<CrisLayoutTab>>) => {
              if (tabsRD.hasSucceeded && tabsRD?.payload?.page?.length > 0) {
                // By splitting the url with uuid we can understand if the item is primary item page or a tab
                const urlSplit = state.url.split(route.params.id);
                // If a no or wrong tab is given redirect to the first tab available
                if (!!tabsRD.payload && !!tabsRD.payload.page && tabsRD.payload.page.length > 0 && !urlSplit[1]) {
                  const selectedTab = tabsRD.payload.page.filter((tab) => !tab.leading)[0];
                  if (!!selectedTab) {
                    let tabName = selectedTab.shortname;

                    if (tabName.includes('::')) {
                      tabName = tabName.split('::')[1];
                    }

                    this.router.navigateByUrl(getItemPageRoute(itemRD.payload) + '/' + tabName);
                  }
                }
              }
              return tabsRD;
            })
          );

        } else {
          return createFailedRemoteDataObject$<PaginatedList<CrisLayoutTab>>(itemRD?.errorMessage, itemRD?.statusCode, itemRD?.timeCompleted);
        }
      })
    );
  }

}
