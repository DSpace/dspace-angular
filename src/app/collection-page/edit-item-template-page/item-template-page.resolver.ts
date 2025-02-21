import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';

import { followLink } from '../../../../modules/core/src/lib/core/data/follow-link-config.model';
import { ItemTemplateDataService } from '../../../../modules/core/src/lib/core/data/item-template-data.service';
import { RemoteData } from '../../../../modules/core/src/lib/core/data/remote-data';
import { Item } from '../../../../modules/core/src/lib/core/shared/item.model';
import { getFirstCompletedRemoteData } from '../../../../modules/core/src/lib/core/shared/operators';

export const itemTemplatePageResolver: ResolveFn<RemoteData<Item>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  itemTemplateService: ItemTemplateDataService = inject(ItemTemplateDataService),
): Observable<RemoteData<Item>> => {
  return itemTemplateService.findByCollectionID(route.params.id, true, false, followLink('templateItemOf')).pipe(
    getFirstCompletedRemoteData(),
  );
};
