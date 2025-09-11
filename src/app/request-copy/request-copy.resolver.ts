import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import {
  ItemRequestDataService,
  RemoteData,
  ItemRequest,
  getFirstCompletedRemoteData,
} from '@dspace/core'
import { Observable } from 'rxjs';

export const requestCopyResolver: ResolveFn<RemoteData<ItemRequest>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  itemRequestDataService: ItemRequestDataService = inject(ItemRequestDataService),
): Observable<RemoteData<ItemRequest>> => {
  return itemRequestDataService.findById(route.params.token).pipe(
    getFirstCompletedRemoteData(),
  );
};
