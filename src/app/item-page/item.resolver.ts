import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { RemoteData } from '../core/data/remote-data';
import { ItemDataService } from '../core/data/item-data.service';
import { Item } from '../core/shared/item.model';
import { followLink, FollowLinkConfig } from '../shared/utils/follow-link-config.model';
import { getFirstCompletedRemoteData } from '../core/shared/operators';
import { Store } from '@ngrx/store';
import { ResolvedAction } from '../core/resolving/resolver.actions';
import { environment } from '../../environments/environment';

/**
 * The self links defined in this list are expected to be requested somewhere in the near future
 * Requesting them as embeds will limit the number of requests
 */
export function getItemPageLinksToFollow(): FollowLinkConfig<Item>[] {
  const followLinks: FollowLinkConfig<Item>[] = [
    followLink('owningCollection', {},
      followLink('parentCommunity', {},
        followLink('parentCommunity'))
    ),
    followLink('relationships'),
    followLink('version', {}, followLink('versionhistory')),
    followLink('bundles', {}, followLink('bitstreams')),
    followLink('thumbnail'),
    followLink('metrics')
  ];
  if (environment.item.showAccessStatuses) {
    followLinks.push(followLink('accessStatus'));
  }
  return followLinks;
}

/**
 * This class represents a resolver that requests a specific item before the route is activated
 */
@Injectable()
export class ItemResolver implements Resolve<RemoteData<Item>> {
  constructor(
    protected itemService: ItemDataService,
    protected store: Store<any>,
    protected router: Router
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
    // Fetch item with cache disabled to have always a fresh item object
    const itemRD$ = this.itemService.findById(route.params.id,
      false,
      true,
      ...getItemPageLinksToFollow(),
    ).pipe(
      getFirstCompletedRemoteData(),
    );

    itemRD$.subscribe((itemRD: RemoteData<Item>) => {
      this.store.dispatch(new ResolvedAction(state.url, itemRD.payload));
    });

    return itemRD$;
  }
}
