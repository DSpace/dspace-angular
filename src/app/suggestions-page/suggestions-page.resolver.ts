import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';

import { RemoteData } from '../core/data/remote-data';
import { OpenaireSuggestionTarget } from '../core/openaire/reciter-suggestions/models/openaire-suggestion-target.model';
import { SuggestionsService } from '../openaire/reciter-suggestions/suggestions.service';
import { getFirstCompletedRemoteData } from '../core/shared/operators';

/**
 * This class represents a resolver that requests a specific collection before the route is activated
 */
@Injectable()
export class SuggestionsPageResolver implements Resolve<RemoteData<OpenaireSuggestionTarget>> {
  constructor(private suggestionService: SuggestionsService) {
  }

  /**
   * Method for resolving a suggestion target based on the parameters in the current route
   * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
   * @param {RouterStateSnapshot} state The current RouterStateSnapshot
   * @returns Observable<<RemoteData<Collection>> Emits the found collection based on the parameters in the current route,
   * or an error if something went wrong
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<RemoteData<OpenaireSuggestionTarget>> {
    return this.suggestionService.getTargetById(route.params.targetId).pipe(
      getFirstCompletedRemoteData(),
    );
  }
}
