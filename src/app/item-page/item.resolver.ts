import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { AppState } from '../app.reducer';
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
export function getItemPageLinksToFollow(): FollowLinkConfig<Item>[] {
  const followLinks: FollowLinkConfig<Item>[] = [
    followLink('owningCollection', {},
      followLink('parentCommunity', {},
        followLink('parentCommunity')),
    ),
    followLink('relationships'),
    followLink('version', {}, followLink('versionhistory')),
    followLink('thumbnail'),
  ];
  if (environment.item.showAccessStatuses) {
    followLinks.push(followLink('accessStatus'));
  }
  return followLinks;
}

export const itemResolver: ResolveFn<RemoteData<Item>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  itemService: ItemDataService = inject(ItemDataService),
  store: Store<AppState> = inject(Store<AppState>),
): Observable<RemoteData<Item>> => {
  const itemRD$ = itemService.findById(
    route.params.id,
    true,
    false,
    ...getItemPageLinksToFollow(),
  ).pipe(
    getFirstCompletedRemoteData(),
  );

  itemRD$.subscribe((itemRD: RemoteData<Item>) => {
    store.dispatch(new ResolvedAction(state.url, itemRD.payload));
  });

  return itemRD$;
};
