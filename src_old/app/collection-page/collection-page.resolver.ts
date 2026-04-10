import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { CollectionDataService } from '@dspace/core/data/collection-data.service';
import { RemoteData } from '@dspace/core/data/remote-data';
import { ResolvedAction } from '@dspace/core/resolving/resolver.actions';
import {
  Collection,
  COLLECTION_PAGE_LINKS_TO_FOLLOW,
} from '@dspace/core/shared/collection.model';
import { getFirstCompletedRemoteData } from '@dspace/core/shared/operators';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AppState } from '../app.reducer';

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
