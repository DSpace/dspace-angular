import { Injectable } from '@angular/core';

import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, take, tap } from 'rxjs/operators';

import { SortDirection, SortOptions } from '../../core/cache/models/sort-options.model';
import { FindListOptions } from '../../core/data/find-list-options.model';
import { RemoteData } from '../../core/data/remote-data';
import { PaginatedList } from '../../core/data/paginated-list.model';
import {
  OpenaireSuggestionTarget
} from '../../core/openaire/reciter-suggestions/models/openaire-suggestion-target.model';
import { ResearcherProfileDataService } from '../../core/profile/researcher-profile-data.service';
import { AuthService } from '../../core/auth/auth.service';
import { EPerson } from '../../core/eperson/models/eperson.model';
import { hasValue, isNotEmpty } from '../../shared/empty.util';
import {
  getFinishedRemoteData,
  getFirstSucceededRemoteDataPayload,
  getFirstSucceededRemoteListPayload
} from '../../core/shared/operators';
import { OpenaireSuggestion } from '../../core/openaire/reciter-suggestions/models/openaire-suggestion.model';
import { WorkspaceitemDataService } from '../../core/submission/workspaceitem-data.service';
import { TranslateService } from '@ngx-translate/core';
import { NoContent } from '../../core/shared/NoContent.model';
import { environment } from '../../../environments/environment';
import { SuggestionConfig } from '../../../config/layout-config.interfaces';
import { WorkspaceItem } from '../../core/submission/models/workspaceitem.model';
import { followLink, FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import {
  QualityAssuranceSuggestionDataService
} from '../../core/openaire/reciter-suggestions/suggestions/quality-assurance-suggestion-data.service';
import {
  QualityAssuranceSuggestionTargetDataService
} from '../../core/openaire/reciter-suggestions/targets/quality-assurance-suggestion-target-data.service';
import {
  OpenaireSuggestionSource
} from '../../core/openaire/reciter-suggestions/models/openaire-suggestion-source.model';

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
   * @param {ResearcherProfileDataService} researcherProfileService
   * @param {QualityAssuranceSuggestionDataService} suggestionsDataService
   * @param {QualityAssuranceSuggestionTargetDataService} suggestionTargetsDataService
   * @param {TranslateService} translateService
   */
  constructor(
    private authService: AuthService,
    private researcherProfileService: ResearcherProfileDataService,
    private suggestionsDataService: QualityAssuranceSuggestionDataService,
    private suggestionTargetsDataService: QualityAssuranceSuggestionTargetDataService,
    private translateService: TranslateService
  ) {
  }

  /**
   * Return a Suggestion Target for a given id
   *
   * @param id                          The target id to retrieve.
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
   *                                    no valid cached version. Defaults to true
   * @param reRequestOnStale            Whether or not the request should automatically be re-requested
   *                                    after the response becomes stale
   * @param linksToFollow               List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved.
   *
   * @return Observable<RemoteData<OpenaireSuggestionTarget>>
   *    The list of Suggestion Target.
   */
  public getTargetById(id: string, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<OpenaireSuggestionSource>[]): Observable<RemoteData<OpenaireSuggestionTarget>> {
    return this.suggestionTargetsDataService.getTargetById(id, useCachedVersionIfAvailable, reRequestOnStale);
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

    return this.suggestionTargetsDataService.getTargetsBySource(source, findListOptions).pipe(
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
  public getSuggestions(targetId: string, elementsPerPage, currentPage, sortOptions: SortOptions): Observable<RemoteData<PaginatedList<OpenaireSuggestion>>> {
    const [source, target] = targetId.split(':');

    const findListOptions: FindListOptions = {
      elementsPerPage: elementsPerPage,
      currentPage: currentPage,
      sort: sortOptions
    };

    return this.suggestionsDataService.getSuggestionsByTargetAndSource(target, source, findListOptions);
  }

  /**
   * Clear suggestions requests from cache
   */
  public clearSuggestionRequests() {
    this.suggestionsDataService.clearSuggestionRequestsCache();
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

  public deleteReviewedSuggestionAsync(suggestionId: string): Observable<RemoteData<NoContent>> {
    return this.suggestionsDataService.deleteSuggestionAsync(suggestionId).pipe(
        tap((response: RemoteData<NoContent>) => {
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
    return this.researcherProfileService.findById(user.id, true, true, followLink('item')).pipe(
      getFirstSucceededRemoteDataPayload(),
      mergeMap((researcherProfile) => this.researcherProfileService.findRelatedItemId(researcherProfile).pipe(
        mergeMap((itemId: string) => {
          if (isNotEmpty(itemId)) {
            return this.suggestionTargetsDataService.getTargetsByUser(itemId, {}, false).pipe(
              getFirstSucceededRemoteListPayload()
            );
          } else {
            return of([]);
          }
        })
      )),
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
                          collectionId: string): Observable<WorkspaceItem> {

    const resolvedCollectionId = this.resolveCollectionId(suggestion, collectionId);
    return workspaceitemService.importExternalSourceEntry(suggestion.externalSourceUri, resolvedCollectionId)
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

  public notMineAsync(suggestionId): Observable<RemoteData<NoContent>> {
    return this.deleteReviewedSuggestionAsync(suggestionId).pipe(
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
      .pipe(map((results: WorkspaceItem[]) => {
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
    return forkJoin(suggestions.map((suggestion: OpenaireSuggestion) => this.notMineAsync(suggestion.id)))
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
      source: this.translateService.instant(this.translateSuggestionSource(suggestionTarget.source)),
      type:  this.translateService.instant(this.translateSuggestionType(suggestionTarget.source)),
      suggestionId: suggestionTarget.id,
      displayName: suggestionTarget.display
    };
  }

  public translateSuggestionType(source: string): string {
    return 'reciter.suggestion.type.' + source;
  }

  public translateSuggestionSource(source: string): string {
    return 'reciter.suggestion.source.' + source;
  }

  /**
   * If the provided collectionId ha no value, tries to resolve it by suggestion source.
   * @param suggestion
   * @param collectionId
   */
  public resolveCollectionId(suggestion: OpenaireSuggestion, collectionId): string {
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
  public isCollectionFixed(suggestions: OpenaireSuggestion[]): boolean {
    return this.getFixedCollectionIds(suggestions).length === 1;
  }

  private getFixedCollectionIds(suggestions: OpenaireSuggestion[]): string[] {
    const collectionIds = {};
    suggestions.forEach((suggestion: OpenaireSuggestion) => {
      const conf = environment.suggestion.find((suggestionConf: SuggestionConfig) => suggestionConf.source === suggestion.source);
      if (hasValue(conf)) {
        collectionIds[conf.collectionId] = true;
      }
    });
    return Object.keys(collectionIds);
  }
}
