import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import {
  ItemDataService,
  RemoteData,
  ResolvedAction,
  getItemPageLinksToFollow,
  Item,
  getFirstCompletedRemoteData,
} from '@dspace/core'
import { APP_CONFIG, AppConfig } from '@dspace/config';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AppState } from '../app.reducer';

export const itemResolver: ResolveFn<RemoteData<Item>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  itemService: ItemDataService = inject(ItemDataService),
  store: Store<AppState> = inject(Store<AppState>),
  appConfig: AppConfig = inject(APP_CONFIG),
): Observable<RemoteData<Item>> => {
  const itemRD$ = itemService.findById(
    route.params.id,
    true,
    false,
    ...getItemPageLinksToFollow(appConfig.item.showAccessStatuses),
  ).pipe(
    getFirstCompletedRemoteData(),
  );

  itemRD$.subscribe((itemRD: RemoteData<Item>) => {
    store.dispatch(new ResolvedAction(state.url, itemRD.payload));
  });

  return itemRD$;
};

