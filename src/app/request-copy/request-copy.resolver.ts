import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';

import { ItemRequestDataService } from '@dspace/core';
import { RemoteData } from '@dspace/core';
import { ItemRequest } from '@dspace/core';
import { getFirstCompletedRemoteData } from '@dspace/core';

export const requestCopyResolver: ResolveFn<RemoteData<ItemRequest>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  itemRequestDataService: ItemRequestDataService = inject(ItemRequestDataService),
): Observable<RemoteData<ItemRequest>> => {
  return itemRequestDataService.findById(route.params.token).pipe(
    getFirstCompletedRemoteData(),
  );
};
