import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';

import { ItemRequestDataService } from '../core/data/item-request-data.service';
import { RemoteData } from '../core/data/remote-data';
import { ItemRequest } from '../core/shared/item-request.model';
import { getFirstCompletedRemoteData } from '../core/shared/operators';

export const requestCopyResolver: ResolveFn<RemoteData<ItemRequest>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  itemRequestDataService: ItemRequestDataService = inject(ItemRequestDataService),
): Observable<RemoteData<ItemRequest>> => {
  return itemRequestDataService.findById(route.params.token).pipe(
    getFirstCompletedRemoteData(),
  );
};
