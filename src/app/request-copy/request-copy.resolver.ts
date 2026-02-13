import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { ItemRequestDataService } from '@dspace/core/data/item-request-data.service';
import { RemoteData } from '@dspace/core/data/remote-data';
import { ItemRequest } from '@dspace/core/shared/item-request.model';
import { getFirstCompletedRemoteData } from '@dspace/core/shared/operators';
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
