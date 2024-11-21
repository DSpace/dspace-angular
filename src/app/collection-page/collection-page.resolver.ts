import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AppState } from '../app.reducer';
import { CollectionDataService } from '../core/data/collection-data.service';
import { RemoteData } from '../core/data/remote-data';
import { ResolvedAction } from '../core/resolving/resolver.actions';
import { Collection } from '../core/shared/collection.model';
import { getFirstCompletedRemoteData } from '../core/shared/operators';
import {
  followLink,
  FollowLinkConfig,
} from '../shared/utils/follow-link-config.model';

/**
 * The self links defined in this list are expected to be requested somewhere in the near future
 * Requesting them as embeds will limit the number of requests
 */
export const COLLECTION_PAGE_LINKS_TO_FOLLOW: FollowLinkConfig<Collection>[] = [
  followLink('parentCommunity', {},
    followLink('parentCommunity'),
  ),
  followLink('logo'),
];

/**
 * Method for resolving a collection based on the parameters in the current route
 * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
 * @param {RouterStateSnapshot} state The current RouterStateSnapshot
 * @param collectionService
 * @param store
 * @returns Observable<<RemoteData<Collection>> Emits the found collection based on the parameters in the current route,
 * or an error if something went wrong
 */
export const collectionPageResolver: ResolveFn<RemoteData<Collection>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  collectionService: CollectionDataService = inject(CollectionDataService),
  store: Store<AppState> = inject(Store<AppState>),
): Observable<RemoteData<Collection>> => {
  const collectionRD$ = collectionService.findById(
    route.params.id,
    true,
    false,
    ...COLLECTION_PAGE_LINKS_TO_FOLLOW,
  ).pipe(
    getFirstCompletedRemoteData(),
  );

  collectionRD$.subscribe((collectionRD: RemoteData<Collection>) => {
    store.dispatch(new ResolvedAction(state.url, collectionRD.payload));
  });

  return collectionRD$;
};
