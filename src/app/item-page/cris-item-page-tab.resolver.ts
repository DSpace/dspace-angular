import { ItemDataService } from './../core/data/item-data.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { RemoteData } from '../core/data/remote-data';
import { CrisLayoutTab } from '../core/layout/models/tab.model';
import { TabDataService } from '../core/layout/tab-data.service';
import { Observable } from 'rxjs';
import { PaginatedList } from '../core/data/paginated-list.model';
import { getFirstCompletedRemoteData, getRemoteDataPayload, getPaginatedListPayload } from '../core/shared/operators';
import { switchMap, map } from 'rxjs/operators';
import { Item } from '../core/shared/item.model';
import { getItemPageRoute } from './item-page-routing-paths';
import { hasValue, isNotEmpty } from '../shared/empty.util';

/**
 * This class represents a resolver that requests the tabs of specific
 * item before the route is activated
 */
@Injectable()
export class CrisItemPageTabResolver implements Resolve<RemoteData<PaginatedList<CrisLayoutTab>>> {

  constructor(private tabService: TabDataService, private itemDataService: ItemDataService, private router: Router, private aroute: ActivatedRoute) { }

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
      getRemoteDataPayload(),
      map((item: Item) => {
        if (!item || (!!item && !item.uuid)) {
          this.router.navigate(['/404']);
        } else if (hasValue(item.metadata) && isNotEmpty(item.metadata['cris.customurl'])) {
          if (route.params.id !== item.metadata['cris.customurl'][0].value) {
            this.router.navigateByUrl(getItemPageRoute(item));
          }
        }
        return item;
      }),
      switchMap((item: Item) => this.tabService.findByItem(
        item.uuid, // Item UUID
        true
      ).pipe(
        getFirstCompletedRemoteData(),
        map((tabs: RemoteData<PaginatedList<CrisLayoutTab>>) => {
          // By splititng the url with uuid we can understand if the item is primary item page or a tab
          const urlSplited = state.url.split(route.params.id);
          if (!!tabs.payload && !!tabs.payload.page && tabs.payload.page.length > 0 && !urlSplited[1]) {
            const selectedTab = tabs.payload.page.filter((tab) => !tab.leading)[0];
            if (!!selectedTab) {
              let tabName = selectedTab.shortname;

              if (tabName.includes('::')) {
                tabName = tabName.split('::')[1];
              }

              this.router.navigateByUrl(getItemPageRoute(item) + '/' + tabName);
            }
          }
          return tabs;
        })
      )
      ));
  }

}
