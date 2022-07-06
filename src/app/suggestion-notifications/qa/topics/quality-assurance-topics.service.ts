import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { find, map } from 'rxjs/operators';
import { QualityAssuranceTopicRestService } from '../../../core/suggestion-notifications/qa/topics/quality-assurance-topic-rest.service';
import { SortDirection, SortOptions } from '../../../core/cache/models/sort-options.model';
import { RemoteData } from '../../../core/data/remote-data';
import { PaginatedList } from '../../../core/data/paginated-list.model';
import { QualityAssuranceTopicObject } from '../../../core/suggestion-notifications/qa/models/quality-assurance-topic.model';
import { RequestParam } from '../../../core/cache/models/request-param.model';
import {FindListOptions} from '../../../core/data/find-list-options.model';

/**
 * The service handling all Quality Assurance topic requests to the REST service.
 */
@Injectable()
export class QualityAssuranceTopicsService {

  /**
   * Initialize the service variables.
   * @param {QualityAssuranceTopicRestService} qualityAssuranceTopicRestService
   */
  constructor(
    private qualityAssuranceTopicRestService: QualityAssuranceTopicRestService
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
      find((rd: RemoteData<PaginatedList<QualityAssuranceTopicObject>>) => !rd.isResponsePending),
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
