import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { CommunityDataService } from '@dspace/core/data/community-data.service';
import { RemoteData } from '@dspace/core/data/remote-data';
import { ResolvedAction } from '@dspace/core/resolving/resolver.actions';
import { Community } from '@dspace/core/shared/community.model';
import {
  followLink,
  FollowLinkConfig,
} from '@dspace/core/shared/follow-link-config.model';
import { getFirstCompletedRemoteData } from '@dspace/core/shared/operators';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AppState } from '../app.reducer';

/**
 * The self links defined in this list are expected to be requested somewhere in the near future
 * Requesting them as embeds will limit the number of requests
 */
export const COMMUNITY_PAGE_LINKS_TO_FOLLOW: FollowLinkConfig<Community>[] = [
  followLink('logo'),
  followLink('subcommunities'),
  followLink('collections'),
  followLink('parentCommunity'),
];

/**
 * Method for resolving a community based on the parameters in the current route
 * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
 * @param {RouterStateSnapshot} state The current RouterStateSnapshot
 * @param {CommunityDataService} communityService
 * @param {Store} store
 * @returns Observable<<RemoteData<Community>> Emits the found community based on the parameters in the current route,
 * or an error if something went wrong
 */
export const communityPageResolver: ResolveFn<RemoteData<Community>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  communityService: CommunityDataService = inject(CommunityDataService),
  store: Store<AppState> = inject(Store<AppState>),
): Observable<RemoteData<Community>> => {
  const communityRD$ = communityService.findById(
    route.params.id,
    true,
    false,
    ...COMMUNITY_PAGE_LINKS_TO_FOLLOW,
  ).pipe(
    getFirstCompletedRemoteData(),
  );

  communityRD$.subscribe((communityRD: RemoteData<Community>) => {
    store.dispatch(new ResolvedAction(state.url, communityRD.payload));
  });

  return communityRD$;
};
