import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  QualityAssuranceTopicDataService
} from '../../../core/notifications/qa/topics/quality-assurance-topic-data.service';
import { SortDirection, SortOptions } from '../../../core/cache/models/sort-options.model';
import { RemoteData } from '../../../core/data/remote-data';
import { PaginatedList } from '../../../core/data/paginated-list.model';
import {
  QualityAssuranceTopicObject
} from '../../../core/notifications/qa/models/quality-assurance-topic.model';
import { RequestParam } from '../../../core/cache/models/request-param.model';
import { FindListOptions } from '../../../core/data/find-list-options.model';
import { getFirstCompletedRemoteData } from '../../../core/shared/operators';

/**
 * The service handling all Quality Assurance topic requests to the REST service.
 */
@Injectable()
export class QualityAssuranceTopicsService {

  /**
   * Initialize the service variables.
   * @param {QualityAssuranceTopicDataService} qualityAssuranceTopicRestService
   */
  constructor(
    private qualityAssuranceTopicRestService: QualityAssuranceTopicDataService
  ) { }

  /**
   * sourceId used to get topics
   */
  sourceId: string;

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
  public getTopics(elementsPerPage, currentPage): Observable<PaginatedList<QualityAssuranceTopicObject>> {
    const sortOptions = new SortOptions('name', SortDirection.ASC);

    const findListOptions: FindListOptions = {
      elementsPerPage: elementsPerPage,
      currentPage: currentPage,
      sort: sortOptions,
      searchParams: [new RequestParam('source', this.sourceId)]
    };

    return this.qualityAssuranceTopicRestService.getTopics(findListOptions).pipe(
      getFirstCompletedRemoteData(),
      map((rd: RemoteData<PaginatedList<QualityAssuranceTopicObject>>) => {
        if (rd.hasSucceeded) {
          return rd.payload;
        } else {
          throw new Error('Can\'t retrieve Quality Assurance topics from the Broker topics REST service');
        }
      })
    );
  }

  /**
   * set sourceId which is used to get topics
   * @param sourceId string
   */
  setSourceId(sourceId: string) {
    this.sourceId = sourceId;
  }
}
