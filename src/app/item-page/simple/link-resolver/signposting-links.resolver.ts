import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { SignpostingLink } from '../../../core/data/signposting-links.model';
import { Observable, of, switchMap } from 'rxjs';
import { inject } from '@angular/core';
import { hasValue } from '../../../shared/empty.util';
import { SignpostingDataService } from '../../../core/data/signposting-data.service';
import { ItemDataService } from '../../../core/data/item-data.service';
import { getFirstCompletedRemoteData } from '../../../core/shared/operators';
import { RemoteData } from '../../../core/data/remote-data';
import { Item } from '../../../core/shared/item.model';
import { getItemPageLinksToFollow } from '../../item.resolver';

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
  return itemService.findById(uuid, true, true, ...getItemPageLinksToFollow(),).pipe(
    getFirstCompletedRemoteData(),
    switchMap((itemRD: RemoteData<Item>) => {
      return itemRD.hasSucceeded ? signpostingDataService.getLinks(itemRD.payload.uuid) : of([]);
    }),
  );
};
