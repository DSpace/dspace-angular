import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { find, map } from 'rxjs/operators';
import { SuggestionTargetRestService } from '../../core/reciter-suggestions/reciter-suggestions-rest.service';
import { SortOptions, SortDirection } from '../../core/cache/models/sort-options.model';
import { FindListOptions } from '../../core/data/request.models';
import { RemoteData } from '../../core/data/remote-data';
import { PaginatedList } from '../../core/data/paginated-list';
import { SuggestionTargetObject } from '../../core/reciter-suggestions/models/suggestion-target.model';

/**
 * The service handling all Suggestion Target  requests to the REST service.
 */
@Injectable()
export class SuggestionTargetsService {

  /**
   * Initialize the service variables.
   * @param {SuggestionTargetRestService} SuggestionTargetRestService
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
}
