import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { RemoteData } from '../core/data/remote-data';
import { ItemDataService } from '../core/data/item-data.service';
import { Item } from '../core/shared/item.model';
import { followLink, FollowLinkConfig } from '../shared/utils/follow-link-config.model';
import { FindListOptions } from '../core/data/request.models';
import { getFirstCompletedRemoteData } from '../core/shared/operators';

export const ITEM_PAGE_LINKS_TO_FOLLOW: FollowLinkConfig<Item>[] = [
  followLink('owningCollection'),
  followLink('bundles', new FindListOptions(), true, true, true, followLink('bitstreams')),
  followLink('relationships'),
  followLink('version', undefined, true, true, true, followLink('versionhistory')),
];

/**
 * This class represents a resolver that requests a specific item before the route is activated
 */
@Injectable()
export class ItemPageResolver implements Resolve<RemoteData<Item>> {
  constructor(private itemService: ItemDataService) {
  }

  /**
   * Method for resolving an item based on the parameters in the current route
   * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
   * @param {RouterStateSnapshot} state The current RouterStateSnapshot
   * @returns Observable<<RemoteData<Item>> Emits the found item based on the parameters in the current route,
   * or an error if something went wrong
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<RemoteData<Item>> {
    return this.itemService.findById(route.params.id,
      true,
      false,
      ...ITEM_PAGE_LINKS_TO_FOLLOW
    ).pipe(
      getFirstCompletedRemoteData(),
    );
  }
}
