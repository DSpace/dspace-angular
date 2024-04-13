import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { followLink } from '../../../shared/utils/follow-link-config.model';
import { IdentifiableDataService } from '../../data/base/identifiable-data.service';
import { RemoteData } from '../../data/remote-data';
import { Item } from '../../shared/item.model';
import { getFirstCompletedRemoteData } from '../../shared/operators';
import { SubmissionObject } from '../models/submission-object.model';

/**
 * Method for resolving an item based on the parameters in the current route
 * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
 * @param {RouterStateSnapshot} state The current RouterStateSnapshot
 * @param {IdentifiableDataService<SubmissionObject> } dataService
 * @returns Observable<<RemoteData<Item>> Emits the found item based on the parameters in the current route,
 * or an error if something went wrong
 */
export const SubmissionObjectResolver: (route: ActivatedRouteSnapshot, state: RouterStateSnapshot, dataService: IdentifiableDataService<SubmissionObject>) => Observable<RemoteData<Item>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  dataService: IdentifiableDataService<SubmissionObject>,
): Observable<RemoteData<Item>> => {
  return dataService.findById(route.params.id,
    true,
    false,
    followLink('item'),
  ).pipe(
    getFirstCompletedRemoteData(),
    switchMap((wfiRD: RemoteData<any>) => wfiRD.payload.item as Observable<RemoteData<Item>>),
    getFirstCompletedRemoteData(),
  );
};
