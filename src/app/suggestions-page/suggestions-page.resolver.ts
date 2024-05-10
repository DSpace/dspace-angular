import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { find } from 'rxjs/operators';

import { RemoteData } from '../core/data/remote-data';
import { SuggestionTarget } from '../core/notifications/models/suggestion-target.model';
import { SuggestionTargetDataService } from '../core/notifications/target/suggestion-target-data.service';
import { hasValue } from '../shared/empty.util';

/**
 * Method for resolving a suggestion target based on the parameters in the current route
 * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
 * @param {RouterStateSnapshot} state The current RouterStateSnapshot
 * @param {SuggestionTargetDataService} suggestionsDataService
 * @returns Observable<<RemoteData<Collection>> Emits the found collection based on the parameters in the current route,
 * or an error if something went wrong
 */
export const suggestionsPageResolver: ResolveFn<RemoteData<SuggestionTarget>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  suggestionsDataService: SuggestionTargetDataService = inject(SuggestionTargetDataService),
): Observable<RemoteData<SuggestionTarget>> => {
  return suggestionsDataService.getTargetById(route.params.targetId).pipe(
    find((RD) => hasValue(RD.hasFailed) || RD.hasSucceeded),
  );
};
