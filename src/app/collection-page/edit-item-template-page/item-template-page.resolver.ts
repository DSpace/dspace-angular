import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';

import { followLink } from '@dspace/core';
import { ItemTemplateDataService } from '@dspace/core';
import { RemoteData } from '@dspace/core';
import { Item } from '@dspace/core';
import { getFirstCompletedRemoteData } from '@dspace/core';

export const itemTemplatePageResolver: ResolveFn<RemoteData<Item>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  itemTemplateService: ItemTemplateDataService = inject(ItemTemplateDataService),
): Observable<RemoteData<Item>> => {
  return itemTemplateService.findByCollectionID(route.params.id, true, false, followLink('templateItemOf')).pipe(
    getFirstCompletedRemoteData(),
  );
};
