import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  forkJoin,
  Observable,
  of,
} from 'rxjs';
import {
  catchError,
  map,
  mergeMap,
  take,
} from 'rxjs/operators';

import { SuggestionConfig } from '../../../config/suggestion-config.interfaces';
import { environment } from '../../../environments/environment';
import {
  SortDirection,
  SortOptions,
} from '../../core/cache/models/sort-options.model';
import { FindListOptions } from '../../core/data/find-list-options.model';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { RemoteData } from '../../core/data/remote-data';
import { Suggestion } from '../../core/notifications/suggestions/models/suggestion.model';
import { SuggestionTarget } from '../../core/notifications/suggestions/models/suggestion-target.model';
import { SuggestionDataService } from '../../core/notifications/suggestions/suggestion-data.service';
import { SuggestionTargetDataService } from '../../core/notifications/suggestions/target/suggestion-target-data.service';
import { ResearcherProfile } from '../../core/profile/model/researcher-profile.model';
import { ResearcherProfileDataService } from '../../core/profile/researcher-profile-data.service';
import { NoContent } from '../../core/shared/NoContent.model';
import {
  getFinishedRemoteData,
  getFirstCompletedRemoteData,
  getFirstSucceededRemoteDataPayload,
  getFirstSucceededRemoteListPayload,
} from '../../core/shared/operators';
import { WorkspaceItem } from '../../core/submission/models/workspaceitem.model';
import { WorkspaceitemDataService } from '../../core/submission/workspaceitem-data.service';
import {
  hasNoValue,
  hasValue,
  isNotEmpty,
} from '../../shared/empty.util';
import { followLink } from '../../shared/utils/follow-link-config.model';
import { getSuggestionPageRoute } from '../../suggestions-page/suggestions-page-routing-paths';

/**
 * useful for multiple approvals and ignores operation
 * */
export interface SuggestionBulkResult {
  success: number;
  fails: number;
}

/**
 * The service handling all Suggestion Target  requests to the REST service.
 */
@Injectable({ providedIn: 'root' })
export class SuggestionsService {

  /**
   * Initialize the service variables.
   * @param {ResearcherProfileDataService} researcherProfileService
   * @param {SuggestionTargetDataService} suggestionTargetDataService
   * @param {SuggestionDataService} suggestionsDataService
   * @param translateService
   */
  constructor(
    private researcherProfileService: ResearcherProfileDataService,
    private suggestionsDataService: SuggestionDataService,
    private suggestionTargetDataService: SuggestionTargetDataService,
    private translateService: TranslateService,
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
  public getTargets(source, elementsPerPage, currentPage): Observable<PaginatedList<SuggestionTarget>> {
    const sortOptions = new SortOptions('display', SortDirection.ASC);

    const findListOptions: FindListOptions = {
      elementsPerPage: elementsPerPage,
      currentPage: currentPage,
      sort: sortOptions,
    };

    return this.suggestionTargetDataService.getTargetsBySource(source, findListOptions).pipe(
      getFinishedRemoteData(),
      take(1),
      map((rd: RemoteData<PaginatedList<SuggestionTarget>>) => {
        if (rd.hasSucceeded) {
          return rd.payload;
        } else {
          throw new Error('Can\'t retrieve Suggestion Target from the Search Target REST service');
        }
      }),
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
   * @return Observable<RemoteData<PaginatedList<Suggestion>>>
   *    The list of Suggestion.
   */
  public getSuggestions(targetId: string, elementsPerPage, currentPage, sortOptions: SortOptions): Observable<RemoteData<PaginatedList<Suggestion>>> {
    const [source, target] = targetId.split(':');

    const findListOptions: FindListOptions = {
      elementsPerPage: elementsPerPage,
      currentPage: currentPage,
      sort: sortOptions,
    };

    return this.suggestionsDataService.getSuggestionsByTargetAndSource(target, source, findListOptions);
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
      take(1),
    );
  }

  /**
   * Retrieve suggestion targets for the given user
   *
   * @param userUuid
   *   The EPerson id for which to retrieve suggestion targets
   */
  public retrieveCurrentUserSuggestions(userUuid: string): Observable<SuggestionTarget[]> {
    if (hasNoValue(userUuid)) {
      return of([]);
    }
    return this.researcherProfileService.findById(userUuid, true, true,  followLink('item')).pipe(
      getFirstCompletedRemoteData(),
      mergeMap((profile: RemoteData<ResearcherProfile> ) => {
        if (isNotEmpty(profile) && profile.hasSucceeded && isNotEmpty(profile.payload)) {
          return this.researcherProfileService.findRelatedItemId(profile.payload).pipe(
            mergeMap((itemId: string) => {
              return this.suggestionTargetDataService.getTargetsByUser(itemId).pipe(
                getFirstSucceededRemoteListPayload(),
              );
            }),
          );
        } else {
          return of([]);
        }
      }),
      catchError(() => of([])),
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
    suggestion: Suggestion,
    collectionId: string): Observable<WorkspaceItem> {

    const resolvedCollectionId = this.resolveCollectionId(suggestion, collectionId);
    return workspaceitemService.importExternalSourceEntry(suggestion.externalSourceUri, resolvedCollectionId)
      .pipe(
        getFirstSucceededRemoteDataPayload(),
        catchError(() => of(null)),
      );
  }

  /**
   * Perform the delete operation over a single suggestion.
   * @param suggestionId
   */
  public ignoreSuggestion(suggestionId): Observable<RemoteData<NoContent>> {
    return this.deleteReviewedSuggestion(suggestionId).pipe(
      catchError(() => of(null)),
    );
  }

  /**
   * Perform a bulk approve and import operation.
   * @param workspaceitemService injected dependency
   * @param suggestions the array containing the suggestions
   * @param collectionId the collectionId
   */
  public approveAndImportMultiple(workspaceitemService: WorkspaceitemDataService,
    suggestions: Suggestion[],
    collectionId: string): Observable<SuggestionBulkResult> {

    return forkJoin(suggestions.map((suggestion: Suggestion) =>
      this.approveAndImport(workspaceitemService, suggestion, collectionId)))
      .pipe(map((results: WorkspaceItem[]) => {
        return {
          success: results.filter((result) => result != null).length,
          fails: results.filter((result) => result == null).length,
        };
      }), take(1));
  }

  /**
   * Perform a bulk ignoreSuggestion operation.
   * @param suggestions the array containing the suggestions
   */
  public ignoreSuggestionMultiple(suggestions: Suggestion[]): Observable<SuggestionBulkResult> {
    return forkJoin(suggestions.map((suggestion: Suggestion) => this.ignoreSuggestion(suggestion.id)))
      .pipe(map((results: RemoteData<NoContent>[]) => {
        return {
          success: results.filter((result) => result != null).length,
          fails: results.filter((result) => result == null).length,
        };
      }), take(1));
  }

  /**
   * Get the researcher uuid (for navigation purpose) from a target instance.
   * TODO Find a better way
   * @param target
   * @return the researchUuid
   */
  public getTargetUuid(target: SuggestionTarget): string {
    const tokens = target.id.split(':');
    return tokens.length === 2 ? tokens[1] : null;
  }

  /**
   * Interpolated params to build the notification suggestions notification.
   * @param suggestionTarget
   */
  public getNotificationSuggestionInterpolation(suggestionTarget: SuggestionTarget): any {
    return {
      count: suggestionTarget.total,
      source: this.translateService.instant(this.translateSuggestionSource(suggestionTarget.source)),
      type:  this.translateService.instant(this.translateSuggestionType(suggestionTarget.source)),
      suggestionId: suggestionTarget.id,
      displayName: suggestionTarget.display,
      url: getSuggestionPageRoute(suggestionTarget.id),
    };
  }

  public translateSuggestionType(source: string): string {
    return 'suggestion.type.' + source;
  }

  public translateSuggestionSource(source: string): string {
    return 'suggestion.source.' + source;
  }

  /**
   * If the provided collectionId ha no value, tries to resolve it by suggestion source.
   * @param suggestion
   * @param collectionId
   */
  public resolveCollectionId(suggestion: Suggestion, collectionId): string {
    if (hasValue(collectionId)) {
      return collectionId;
    }
    return environment.suggestion
      .find((suggestionConf: SuggestionConfig) => suggestionConf.source === suggestion.source)
      .collectionId;
  }

  /**
   * Return true if all the suggestion are configured with the same fixed collection
   * in the configuration.
   * @param suggestions
   */
  public isCollectionFixed(suggestions: Suggestion[]): boolean {
    return this.getFixedCollectionIds(suggestions).length === 1;
  }

  private getFixedCollectionIds(suggestions: Suggestion[]): string[] {
    const collectionIds = {};
    suggestions.forEach((suggestion: Suggestion) => {
      const conf = environment.suggestion.find((suggestionConf: SuggestionConfig) => suggestionConf.source === suggestion.source);
      if (hasValue(conf)) {
        collectionIds[conf.collectionId] = true;
      }
    });
    return Object.keys(collectionIds);
  }
}
