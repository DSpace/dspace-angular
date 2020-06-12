import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { RemoteData } from '../core/data/remote-data';
import { Tab } from '../core/layout/models/tab.model';
import { TabDataService } from '../core/layout/tab-data.service';
import { Observable, pipe } from 'rxjs';
import { find } from 'rxjs/operators';
import { hasValue } from '../shared/empty.util';
import { PaginatedList } from '../core/data/paginated-list';

/**
 * This class represents a resolver that requests the tabs of specific
 * item before the route is activated
 */
@Injectable()
export class CrisItemPageTabResolver implements Resolve<RemoteData<PaginatedList<Tab>>> {

  constructor(private tabService: TabDataService) { }

  /**
   * Method for resolving the tabs of item based on the parameters in the current route
   * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
   * @param {RouterStateSnapshot} state The current RouterStateSnapshot
   * @returns Observable<<RemoteData<Item>> Emits the found item based on the parameters in the current route,
   * or an error if something went wrong
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<RemoteData<PaginatedList<Tab>>> {
    return this.tabService.findByItem(
        route.params.id // Item UUID
      ).pipe(
        find((RD) => hasValue(RD.error) || RD.hasSucceeded)
      );
  }

}
