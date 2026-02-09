import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { ItemDataService } from '@dspace/core/data/item-data.service';
import { RemoteData } from '@dspace/core/data/remote-data';
import { SignpostingDataService } from '@dspace/core/data/signposting-data.service';
import { SignpostingLink } from '@dspace/core/data/signposting-links.model';
import {
  getItemPageLinksToFollow,
  Item,
} from '@dspace/core/shared/item.model';
import { getFirstCompletedRemoteData } from '@dspace/core/shared/operators';
import { hasValue } from '@dspace/shared/utils/empty.util';
import {
  Observable,
  of,
} from 'rxjs';
import { switchMap } from 'rxjs/operators';

/**
 * Resolver to retrieve signposting links before an eventual redirect of any route guard
 *
 * @param route
 * @param state
 * @param itemService
 * @param signpostingDataService
 */
export const signpostingLinksResolver: ResolveFn<Observable<SignpostingLink[]>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  itemService: ItemDataService = inject(ItemDataService),
  signpostingDataService: SignpostingDataService = inject(SignpostingDataService),
): Observable<SignpostingLink[]> => {
  const uuid = route.params.id;
  if (!hasValue(uuid)) {
    return of([]);
  }
  return itemService.findByIdOrCustomUrl(uuid, true, true, ...getItemPageLinksToFollow()).pipe(
    getFirstCompletedRemoteData(),
    switchMap((itemRD: RemoteData<Item>) => {
      return itemRD.hasSucceeded ? signpostingDataService.getLinks(itemRD.payload.uuid) : of([]);
    }),
  );
};
