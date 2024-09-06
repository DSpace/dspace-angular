import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
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

const ITEM_PAGE_LINKS_TO_FOLLOW: FollowLinkConfig<Item>[] = [
  followLink('owningCollection', {},
    followLink('parentCommunity', {},
      followLink('parentCommunity')),
  ),
  followLink('bundles', {}, followLink('bitstreams')),
  followLink('relationships'),
  followLink('version', {}, followLink('versionhistory')),
  followLink('metrics'),
];

export const editItemRelationshipsResolver: ResolveFn<RemoteData<Item>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): Observable<RemoteData<Item>> => {
  const itemService = inject(ItemDataService);
  const store = inject(Store);

  const itemRD$ = itemService.findById(
    route.params.id,
    true,
    false,
    ...ITEM_PAGE_LINKS_TO_FOLLOW,
  ).pipe(
    getFirstCompletedRemoteData(),
  );

  itemRD$.subscribe((itemRD: RemoteData<Item>) => {
    store.dispatch(new ResolvedAction(state.url, itemRD.payload));
  });

  return itemRD$;
};
