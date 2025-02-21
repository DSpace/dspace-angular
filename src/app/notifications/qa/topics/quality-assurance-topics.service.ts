import { Injectable } from '@angular/core';
import { hasValue } from '@dspace/shared/utils';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { RequestParam } from '../../../../../modules/core/src/lib/core/cache/models/request-param.model';
import {
  SortDirection,
  SortOptions,
} from '../../../../../modules/core/src/lib/core/cache/models/sort-options.model';
import { FindListOptions } from '../../../../../modules/core/src/lib/core/data/find-list-options.model';
import { PaginatedList } from '../../../../../modules/core/src/lib/core/data/paginated-list.model';
import { RemoteData } from '../../../../../modules/core/src/lib/core/data/remote-data';
import { QualityAssuranceTopicObject } from '../../../../../modules/core/src/lib/core/notifications/qa/models/quality-assurance-topic.model';
import { QualityAssuranceTopicDataService } from '../../../../../modules/core/src/lib/core/notifications/qa/topics/quality-assurance-topic-data.service';
import { getFirstCompletedRemoteData } from '../../../../../modules/core/src/lib/core/shared/operators';

/**
 * The service handling all Quality Assurance topic requests to the REST service.
 */
@Injectable({ providedIn: 'root' })
export class QualityAssuranceTopicsService {

  /**
   * Initialize the service variables.
   * @param {QualityAssuranceTopicDataService} qualityAssuranceTopicRestService
   */
  constructor(
    private qualityAssuranceTopicRestService: QualityAssuranceTopicDataService,
  ) { }


  /**
   * Return the list of Quality Assurance topics managing pagination and errors.
   *
   * @param elementsPerPage
   *    The number of the topics per page
   * @param currentPage
   *    The page number to retrieve
   * @return Observable<PaginatedList<QualityAssuranceTopicObject>>
   *    The list of Quality Assurance topics.
   */
  public getTopics(elementsPerPage, currentPage, source: string, target?: string): Observable<PaginatedList<QualityAssuranceTopicObject>> {
    const sortOptions = new SortOptions('name', SortDirection.ASC);
    const findListOptions: FindListOptions = {
      elementsPerPage: elementsPerPage,
      currentPage: currentPage,
      sort: sortOptions,
      searchParams: [new RequestParam('source', source)],
    };

    let request$: Observable<RemoteData<PaginatedList<QualityAssuranceTopicObject>>>;

    if (hasValue(target)) {
      findListOptions.searchParams.push(new RequestParam('target', target));
      request$ = this.qualityAssuranceTopicRestService.searchTopicsByTarget(findListOptions);
    } else {
      request$ = this.qualityAssuranceTopicRestService.searchTopicsBySource(findListOptions);
    }

    return request$.pipe(
      getFirstCompletedRemoteData(),
      map((rd: RemoteData<PaginatedList<QualityAssuranceTopicObject>>) => {
        if (rd.hasSucceeded) {
          return rd.payload;
        } else {
          throw new Error('Can\'t retrieve Quality Assurance topics from the Broker topics REST service');
        }
      }),
    );
  }
}
