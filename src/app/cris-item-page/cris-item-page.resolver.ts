import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';

import { ItemDataService } from '../core/data/item-data.service';
import { RemoteData } from '../core/data/remote-data';
import { Item } from '../core/shared/item.model';
import { getFirstCompletedRemoteData } from '../core/shared/operators';
import { followLink } from '../shared/utils/follow-link-config.model';


/**
 * Method for resolving an item based on the parameters in the current route
 * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
 * @param {RouterStateSnapshot} state The current RouterStateSnapshot
 * @returns Observable<<RemoteData<Item>> Emits the found item based on the parameters in the current route,
 * or an error if something went wrong
 */
export const crisItemPageResolver: ResolveFn<RemoteData<Item>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): Observable<RemoteData<Item>> => {
  // TODO temporary disable cache to have always an update item, check if after update with 7.3, it's only necessary to invalidate a cache on edit item saving
  const itemService = inject(ItemDataService);

  return itemService.findById(
    route.params.id,
    false,
    true,
    followLink('owningCollection'),
    followLink('bundles'),
    followLink('relationships'),
    followLink('version', {}, followLink('versionhistory')),
  ).pipe(
    getFirstCompletedRemoteData(),
  );
};
