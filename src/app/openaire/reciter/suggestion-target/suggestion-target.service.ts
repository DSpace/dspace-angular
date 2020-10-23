import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { find, map, take } from 'rxjs/operators';
import { SuggestionTargetRestService } from '../../../core/openaire/reciter-suggestions/reciter-suggestions-rest.service';
import { SortDirection, SortOptions } from '../../../core/cache/models/sort-options.model';
import { FindListOptions } from '../../../core/data/request.models';
import { RemoteData } from '../../../core/data/remote-data';
import { PaginatedList } from '../../../core/data/paginated-list';
import { SuggestionTargetObject } from '../../../core/openaire/reciter-suggestions/models/suggestion-target.model';

/**
 * The service handling all Suggestion Target  requests to the REST service.
 */
@Injectable()
export class SuggestionTargetsService {

  /**
   * Initialize the service variables.
   * @param {SuggestionTargetRestService} suggestionTargetRestService
   */
  constructor(
    private suggestionTargetRestService: SuggestionTargetRestService
  ) { }

  /**
   * Return the list of Suggestion Target managing pagination and errors.
   *
   * @param elementsPerPage
   *    The number of the target per page
   * @param currentPage
   *    The page number to retrieve
   * @return Observable<PaginatedList<SuggestionTargetObject>>
   *    The list of Suggestion Targets.
   */
  public getTargets(elementsPerPage, currentPage): Observable<PaginatedList<SuggestionTargetObject>> {
    const sortOptions = new SortOptions('display', SortDirection.ASC);

    const findListOptions: FindListOptions = {
      elementsPerPage: elementsPerPage,
      currentPage: currentPage,
      sort: sortOptions
    };

    return this.suggestionTargetRestService.getTargets(findListOptions).pipe(
      find((rd: RemoteData<PaginatedList<SuggestionTargetObject>>) => !rd.isResponsePending),
      map((rd: RemoteData<PaginatedList<SuggestionTargetObject>>) => {
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
   * @param elementsPerPage
   *    The number of the target per page
   * @param currentPage
   *    The page number to retrieve
   * @param reciterId
   *    The page number to retrieve
   * @return Observable<PaginatedList<SuggestionTargetObject>>
   *    The list of Suggestion Targets.
   */
  public getReviewSuggestions(elementsPerPage, currentPage, reciterId: string): Observable<PaginatedList<any>> {
    const sortOptions = new SortOptions('display', SortDirection.ASC);

    const findListOptions: FindListOptions = {
      elementsPerPage: elementsPerPage,
      currentPage: currentPage,
      sort: sortOptions
    };

    return this.suggestionTargetRestService.getReviewSuggestions(findListOptions, reciterId).pipe(
      find((rd: RemoteData<PaginatedList<SuggestionTargetObject>>) => !rd.isResponsePending),
      map((rd: RemoteData<PaginatedList<SuggestionTargetObject>>) => {
        if (rd.hasSucceeded) {
          return rd.payload;
        } else {
          throw new Error('Can\'t retrieve Suggestion Target from the Search Target REST service');
        }
      })
    );
  }

  /**
   * Used to delete Suggestion
   * @suggestionId
   */
  public deleteReviewSuggestions(suggestionId: string): Observable<any> {
    return this.suggestionTargetRestService.deleteReviewSuggestions(suggestionId).pipe(
      map((rd: RemoteData<any>) => {
        if (rd.hasSucceeded) {
          return rd.payload;
        } else {
          throw new Error('Can\'t delete Suggestion from the Search Target REST service');
        }
      }),
      take(1)
    );
  }

   /**
    * Used to get Suggestion for notification
    * @suggestionId
    */
  public getSuggestion(suggestionId: string): Observable<any> {
    return this.suggestionTargetRestService.getSuggestion(suggestionId).pipe(
      map((rd: RemoteData<any>) => {
        if (rd.hasSucceeded) {
          return rd.payload;
        } else {
          throw new Error('Can\'t delete Suggestion from the Suggestion Target REST service');
        }
      })
    );
  }
}
