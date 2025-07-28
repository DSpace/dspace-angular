import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { ItemTemplateDataService } from '@core/data/item-template-data.service';
import { RemoteData } from '@core/data/remote-data';
import { followLink } from '@core/shared/follow-link-config.model';
import { Item } from '@core/shared/item.model';
import { getFirstCompletedRemoteData } from '@core/shared/operators';
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
