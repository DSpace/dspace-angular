import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { IdentifiableDataService } from '../../data/base/identifiable-data.service';
import { RemoteData } from '../../data/remote-data';
import { Item } from '../../shared/item.model';
import { getFirstCompletedRemoteData } from '../../shared/operators';
import { SubmissionObject } from '../models/submission-object.model';
import { SUBMISSION_LINKS_TO_FOLLOW } from './submission-links-to-follow';

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
    ...SUBMISSION_LINKS_TO_FOLLOW,
  ).pipe(
    getFirstCompletedRemoteData(),
    switchMap((wfiRD: RemoteData<any>) => wfiRD.payload.item as Observable<RemoteData<Item>>),
    getFirstCompletedRemoteData(),
  );
};
