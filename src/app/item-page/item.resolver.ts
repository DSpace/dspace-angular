import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { ItemDataService } from '../core/data/item-data.service';
import { RemoteData } from '../core/data/remote-data';
import { ResolvedAction } from '../core/resolving/resolver.actions';
import { Item } from '../core/shared/item.model';
import { getFirstCompletedRemoteData } from '../core/shared/operators';
import {
  followLink,
  FollowLinkConfig,
} from '../shared/utils/follow-link-config.model';

/**
 * The self links defined in this list are expected to be requested somewhere in the near future
 * Requesting them as embeds will limit the number of requests
 */
export const ITEM_PAGE_LINKS_TO_FOLLOW: FollowLinkConfig<Item>[] = [
  followLink('owningCollection', {},
    followLink('parentCommunity', {},
      followLink('parentCommunity')),
  ),
  followLink('relationships'),
  followLink('version', {}, followLink('versionhistory')),
  followLink('thumbnail'),
];

/**
 * This class represents a resolver that requests a specific item before the route is activated
 */
@Injectable({ providedIn: 'root' })
export class ItemResolver implements Resolve<RemoteData<Item>> {
  constructor(
    protected itemService: ItemDataService,
    protected store: Store<any>,
    protected router: Router,
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
      ...ITEM_PAGE_LINKS_TO_FOLLOW,
    ).pipe(
      getFirstCompletedRemoteData(),
    );

    itemRD$.subscribe((itemRD: RemoteData<Item>) => {
      this.store.dispatch(new ResolvedAction(state.url, itemRD.payload));
    });

    return itemRD$;
  }
}
