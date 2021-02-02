import { Injectable } from '@angular/core';

import { forkJoin, Observable, of as observableOf } from 'rxjs';
import { catchError, map, mergeMap, take } from 'rxjs/operators';

import { OpenaireSuggestionsDataService } from '../../core/openaire/reciter-suggestions/openaire-suggestions-data.service';
import { SortDirection, SortOptions } from '../../core/cache/models/sort-options.model';
import { FindListOptions } from '../../core/data/request.models';
import { RemoteData } from '../../core/data/remote-data';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { OpenaireSuggestionTarget } from '../../core/openaire/reciter-suggestions/models/openaire-suggestion-target.model';
import { ResearcherProfileService } from '../../core/profile/researcher-profile.service';
import { AuthService } from '../../core/auth/auth.service';
import { EPerson } from '../../core/eperson/models/eperson.model';
import { isNotEmpty } from '../../shared/empty.util';
import { ResearcherProfile } from '../../core/profile/model/researcher-profile.model';
import {
  getAllSucceededRemoteDataPayload,
  getFinishedRemoteData,
  getFirstSucceededRemoteDataPayload,
  getFirstSucceededRemoteListPayload
} from '../../core/shared/operators';
import { OpenaireSuggestion } from '../../core/openaire/reciter-suggestions/models/openaire-suggestion.model';
import { of } from 'rxjs/internal/observable/of';
import { WorkspaceitemDataService } from '../../core/submission/workspaceitem-data.service';
import { TranslateService } from '@ngx-translate/core';
import { NoContent } from '../../core/shared/NoContent.model';

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
    private suggestionsDataService: OpenaireSuggestionsDataService,
    private translateService: TranslateService
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
   * @param sortOptions
   *    The sort options
   * @return Observable<RemoteData<PaginatedList<OpenaireSuggestion>>>
   *    The list of Suggestion.
   */
  public getSuggestions(targetId: string, elementsPerPage, currentPage, sortOptions: SortOptions): Observable<PaginatedList<OpenaireSuggestion>> {
    const [source, target] = targetId.split(':');

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
  public deleteReviewedSuggestion(suggestionId: string): Observable<RemoteData<NoContent>> {
    return this.suggestionsDataService.deleteSuggestion(suggestionId).pipe(
      map((response: RemoteData<NoContent>) => {
        if (response.isSuccess) {
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
      mergeMap((profile: ResearcherProfile) => {
        if (isNotEmpty(profile)) {
          return this.researcherProfileService.findRelatedItemId(profile).pipe(
            mergeMap((itemId: string) => {
              return this.suggestionsDataService.getTargetsByUser(itemId).pipe(
                getFirstSucceededRemoteListPayload()
              );
            })
          );
        } else {
          return observableOf([]);
        }
      }),
      take(1)
    );
  }

  /**
   * Perform the approve and import operation over a single suggestion
   * @param suggestion target suggestion
   * @param collectionId the collectionId
   * @param workspaceitemService injected dependency
   * @private
   */
  public approveAndImport(workspaceitemService: WorkspaceitemDataService,
                          suggestion: OpenaireSuggestion,
                          collectionId: string): Observable<string> {
    return workspaceitemService.importExternalSourceEntry(suggestion.externalSourceUri, collectionId)
      .pipe(
        getFirstSucceededRemoteDataPayload(),
        catchError((error) => of(null))
      );
  }

  /**
   * Perform the delete operation over a single suggestion.
   * @param suggestionId
   */
  public notMine(suggestionId): Observable<RemoteData<NoContent>> {
    return this.deleteReviewedSuggestion(suggestionId).pipe(
      catchError((error) => of(null))
    );
  }

  /**
   * Perform a bulk approve and import operation.
   * @param workspaceitemService injected dependency
   * @param suggestions the array containing the suggestions
   * @param collectionId the collectionId
   */
  public approveAndImportMultiple(workspaceitemService: WorkspaceitemDataService,
                                  suggestions: OpenaireSuggestion[],
                                  collectionId: string): Observable<SuggestionBulkResult> {

    return forkJoin(suggestions.map((suggestion: OpenaireSuggestion) =>
      this.approveAndImport(workspaceitemService, suggestion, collectionId)))
      .pipe(map((results: string[]) => {
        return {
          success: results.filter((result) => result != null).length,
          fails: results.filter((result) => result == null).length
        };
      }), take(1));
  }

  /**
   * Perform a bulk notMine operation.
   * @param suggestions the array containing the suggestions
   */
  public notMineMultiple(suggestions: OpenaireSuggestion[]): Observable<SuggestionBulkResult> {
    return forkJoin(suggestions.map((suggestion: OpenaireSuggestion) => this.notMine(suggestion.id)))
      .pipe(map((results: RemoteData<NoContent>[]) => {
        return {
          success: results.filter((result) => result != null).length,
          fails: results.filter((result) => result == null).length
        };
      }), take(1));
  }

  /**
   * Get the researcher uuid (for navigation purpose) from a target instance.
   * TODO Find a better way
   * @param target
   * @return the researchUuid
   */
  public getTargetUuid(target: OpenaireSuggestionTarget): string {
    const tokens = target.id.split(':');
    return tokens.length === 2 ? tokens[1] : null;
  }

  /**
   * Interpolated params to build the notification suggestions notification.
   * @param suggestionTarget
   */
  public getNotificationSuggestionInterpolation(suggestionTarget: OpenaireSuggestionTarget): any {
    return {
      count: suggestionTarget.total,
      source: this.translateService.instant('reciter.suggestion.source.oaire'),
      suggestionId: suggestionTarget.id,
      displayName: suggestionTarget.display
    };
  }

}
