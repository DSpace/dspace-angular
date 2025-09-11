import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import {
  ItemTemplateDataService,
  RemoteData,
  followLink,
  Item,
  getFirstCompletedRemoteData,
} from '@dspace/core'
import { Observable } from 'rxjs';

export const itemTemplatePageResolver: ResolveFn<RemoteData<Item>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  itemTemplateService: ItemTemplateDataService = inject(ItemTemplateDataService),
): Observable<RemoteData<Item>> => {
  return itemTemplateService.findByCollectionID(route.params.id, true, false, followLink('templateItemOf')).pipe(
    getFirstCompletedRemoteData(),
  );
};
