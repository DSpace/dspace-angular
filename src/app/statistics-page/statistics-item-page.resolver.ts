import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { RemoteData } from '../core/data/remote-data';
import { ItemDataService } from '../core/data/item-data.service';
import { Item } from '../core/shared/item.model';
import { getFirstCompletedRemoteData } from '../core/shared/operators';
import { ResolvedAction } from '../core/resolving/resolver.actions';
import { getItemPageLinksToFollow } from 'src/app/item-page/item.resolver';

/**
 * This class represents a resolver that requests a specific item before the route is activated
 */
@Injectable()
export class StatisticsItemPageResolver implements Resolve<RemoteData<Item>> {
  constructor(
    private itemService: ItemDataService,
    private store: Store<any>
  ) {
  }

  /**
   * Method for resolving an item based on the parameters in the current route
   * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
   * @param {RouterStateSnapshot} state The current RouterStateSnapshot
   * @returns Observable<<RemoteData<Item>> Emits the found item based on the parameters in the current route,
   * or an error if something went wrong
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<RemoteData<Item>> {
    const itemRD$ = this.itemService.findById(route.params.id,
      true,
      false,
      ...getItemPageLinksToFollow()
    ).pipe(
      getFirstCompletedRemoteData()
    );

    itemRD$.subscribe((itemRD: RemoteData<Item>) => {
      this.store.dispatch(new ResolvedAction(state.url, itemRD.payload));
    });

    return itemRD$;
  }
}
