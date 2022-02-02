import { ItemDataService } from './../core/data/item-data.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { RemoteData } from '../core/data/remote-data';
import { CrisLayoutTab } from '../core/layout/models/tab.model';
import { TabDataService } from '../core/layout/tab-data.service';
import { Observable } from 'rxjs';
import { PaginatedList } from '../core/data/paginated-list.model';
import { getFirstCompletedRemoteData, getRemoteDataPayload } from '../core/shared/operators';
import { switchMap } from 'rxjs/operators';
import { Item } from '../core/shared/item.model';

/**
 * This class represents a resolver that requests the tabs of specific
 * item before the route is activated
 */
@Injectable()
export class CrisItemPageTabResolver implements Resolve<RemoteData<PaginatedList<CrisLayoutTab>>> {

  constructor(private tabService: TabDataService, private itemDataService: ItemDataService) { }

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
      switchMap((item: Item) => this.tabService.findByItem(
        item.uuid, // Item UUID
        true
      ).pipe(getFirstCompletedRemoteData())
      ));
  }

}
