import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { ItemDataService } from '@dspace/core/data/item-data.service';
import { RemoteData } from '@dspace/core/data/remote-data';
import { ResolvedAction } from '@dspace/core/resolving/resolver.actions';
import {
  getItemPageLinksToFollow,
  Item,
} from '@dspace/core/shared/item.model';
import { getFirstCompletedRemoteData } from '@dspace/core/shared/operators';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AppState } from '../app.reducer';

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
