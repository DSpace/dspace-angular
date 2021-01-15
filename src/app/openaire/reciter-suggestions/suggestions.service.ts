import { Injectable } from '@angular/core';

import { forkJoin, Observable, of as observableOf, throwError } from 'rxjs';
import { catchError, flatMap, map, switchMap, take } from 'rxjs/operators';

import { OpenaireSuggestionsDataService } from '../../core/openaire/reciter-suggestions/openaire-suggestions-data.service';
import { SortDirection, SortOptions } from '../../core/cache/models/sort-options.model';
import { FindListOptions } from '../../core/data/request.models';
import { RemoteData } from '../../core/data/remote-data';
import { PaginatedList } from '../../core/data/paginated-list';
import { OpenaireSuggestionTarget } from '../../core/openaire/reciter-suggestions/models/openaire-suggestion-target.model';
import { ResearcherProfileService } from '../../core/profile/researcher-profile.service';
import { AuthService } from '../../core/auth/auth.service';
import { EPerson } from '../../core/eperson/models/eperson.model';
import { isNotEmpty } from '../../shared/empty.util';
import { ResearcherProfile } from '../../core/profile/model/researcher-profile.model';
import {
  getAllSucceededRemoteDataPayload,
  getFinishedRemoteData, getFirstSucceededRemoteDataPayload,
  getFirstSucceededRemoteListPayload
} from '../../core/shared/operators';
import { RestResponse } from '../../core/cache/response.models';
import { OpenaireSuggestion } from '../../core/openaire/reciter-suggestions/models/openaire-suggestion.model';
import { of } from 'rxjs/internal/observable/of';
import { tap } from 'rxjs/internal/operators/tap';
import { ItemDataService } from '../../core/data/item-data.service';

export interface SuggestionBulkResult {
  success: number;
  fails: number;
}

/**
 * The service handling all Suggestion Target  requests to the REST service.
 */
@Injectable()
export class SuggestionsService {

  /**
   * Initialize the service variables.
   * @param {AuthService} authService
   * @param {ResearcherProfileService} researcherProfileService
   * @param {OpenaireSuggestionsDataService} suggestionsDataService
   */
  constructor(
    private authService: AuthService,
    private researcherProfileService: ResearcherProfileService,
    private suggestionsDataService: OpenaireSuggestionsDataService
  ) {
  }

  /**
   * Return the list of Suggestion Target managing pagination and errors.
   *
   * @param source
   *    The source for which to retrieve targets
   * @param elementsPerPage
   *    The number of the target per page
   * @param currentPage
   *    The page number to retrieve
   * @return Observable<PaginatedList<OpenaireReciterSuggestionTarget>>
   *    The list of Suggestion Targets.
   */
  public getTargets(source, elementsPerPage, currentPage): Observable<PaginatedList<OpenaireSuggestionTarget>> {
    const sortOptions = new SortOptions('display', SortDirection.ASC);

    const findListOptions: FindListOptions = {
      elementsPerPage: elementsPerPage,
      currentPage: currentPage,
      sort: sortOptions
    };

    return this.suggestionsDataService.getTargets(source, findListOptions).pipe(
      getFinishedRemoteData(),
      take(1),
      map((rd: RemoteData<PaginatedList<OpenaireSuggestionTarget>>) => {
        if (rd.hasSucceeded) {
          return rd.payload;
        } else {
          throw new Error('Can\'t retrieve Suggestion Target from the Search Target REST service');
        }
      })
    );
  }

  /**
   * Return the list of review suggestions Target managing pagination and errors.
   *
   * @param targetId
   *    The target id for which to find suggestions.
   * @param elementsPerPage
   *    The number of the target per page
   * @param currentPage
   *    The page number to retrieve
   * @return Observable<RemoteData<PaginatedList<OpenaireSuggestion>>>
   *    The list of Suggestion.
   */
  public getSuggestions(targetId: string, elementsPerPage, currentPage): Observable<PaginatedList<OpenaireSuggestion>> {
    const [source, target] = targetId.split(':');

    const sortOptions = new SortOptions('display', SortDirection.ASC);

    const findListOptions: FindListOptions = {
      elementsPerPage: elementsPerPage,
      currentPage: currentPage,
      sort: sortOptions
    };

    return this.suggestionsDataService.getSuggestionsByTargetAndSource(target, source, findListOptions).pipe(
      getAllSucceededRemoteDataPayload()
    );
  }

  /**
   * Clear suggestions requests from cache
   */
  public clearSuggestionRequests() {
    this.suggestionsDataService.clearSuggestionRequests();
  }

  /**
   * Used to delete Suggestion
   * @suggestionId
   */
  public deleteReviewedSuggestion(suggestionId: string): Observable<RestResponse> {
    return this.suggestionsDataService.deleteSuggestion(suggestionId).pipe(
      map((response: RestResponse) => {
        if (response.isSuccessful) {
          return response;
        } else {
          throw new Error('Can\'t delete Suggestion from the Search Target REST service');
        }
      }),
      take(1)
    );
  }

  /**
   * Retrieve suggestion targets for the given user
   *
   * @param user
   *   The EPerson object for which to retrieve suggestion targets
   */
  public retrieveCurrentUserSuggestions(user: EPerson): Observable<OpenaireSuggestionTarget[]> {
    return this.researcherProfileService.findById(user.uuid).pipe(
      flatMap((profile: ResearcherProfile) => {
        if (isNotEmpty(profile)) {
          return this.researcherProfileService.findRelatedItemId(profile).pipe(
            flatMap((itemId: string) => {
              return this.suggestionsDataService.getTargetsByUser(itemId).pipe(
                getFirstSucceededRemoteListPayload()
              )
            })
          );
        } else {
          return observableOf([])
        }
      }),
      take(1)
    )
  }

  /**
   * Perform the approve and import operation over a single suggestion
   * @param suggestion target suggestion
   * @param collectionId the collectionId
   * @param itemService injected dependency
   * @private
   */
  public approveAndImport(itemService: ItemDataService, suggestion: OpenaireSuggestion, collectionId: string): Observable<string> {
    return itemService.importExternalSourceEntry(suggestion.externalSourceUri, collectionId)
      .pipe(
        getFirstSucceededRemoteDataPayload(),
        tap((res) => {
          console.log(res);
        }),
        switchMap((res) => {
          return this.deleteReviewedSuggestion(suggestion.id).pipe(
            catchError((error) => of(null))
          );
        }),
        catchError((error) => of(null))
      );
    ;
  }

  /**
   * Perform the delete operation over a single suggestion.
   * @param suggestionId
   */
  public notMine(suggestionId): Observable<any> {
    return this.deleteReviewedSuggestion(suggestionId).pipe(
      catchError((error) => of(null))
    )
  }

  /**
   * Perform a bulk approve and import operation.
   * @param itemService injected dependency
   * @param suggestions the array containing the suggestions
   * @param collectionId the collectionId
   */
  public approveAndImportMultiple(itemService: ItemDataService,
                                  suggestions: OpenaireSuggestion[],
                                  collectionId: string): Observable<SuggestionBulkResult> {

    return forkJoin(suggestions.map((suggestion: OpenaireSuggestion) => this.approveAndImport(itemService, suggestion, collectionId)))
      .pipe(map((results: string[]) => {
        return {
          success: results.filter((result) => result != null).length,
          fails: results.filter((result) => result == null).length
        }
      }), take(1));
  }

  /**
   * Perform a bulk notMine operation.
   * @param suggestions the array containing the suggestions
   */
  public notMineMultiple(suggestions: OpenaireSuggestion[]): Observable<SuggestionBulkResult> {
    return forkJoin(suggestions.map((suggestion: OpenaireSuggestion) => this.notMine(suggestion.id)))
      .pipe(map((results: string[]) => {
        return {
          success: results.filter((result) => result != null).length,
          fails: results.filter((result) => result == null).length
        }
      }), take(1));
  }

}
