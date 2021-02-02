import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { find, map } from 'rxjs/operators';
import { OpenaireBrokerTopicRestService } from '../../../core/openaire/broker/topics/openaire-broker-topic-rest.service';
import { SortDirection, SortOptions } from '../../../core/cache/models/sort-options.model';
import { FindListOptions } from '../../../core/data/request.models';
import { RemoteData } from '../../../core/data/remote-data';
import { PaginatedList } from '../../../core/data/paginated-list.model';
import { OpenaireBrokerTopicObject } from '../../../core/openaire/broker/models/openaire-broker-topic.model';

/**
 * The service handling all OpenAIRE Broker topic requests to the REST service.
 */
@Injectable()
export class OpenaireBrokerTopicsService {

  /**
   * Initialize the service variables.
   * @param {OpenaireBrokerTopicRestService} openaireBrokerTopicRestService
   */
  constructor(
    private openaireBrokerTopicRestService: OpenaireBrokerTopicRestService
  ) { }

  /**
   * Return the list of OpenAIRE Broker topics managing pagination and errors.
   *
   * @param elementsPerPage
   *    The number of the topics per page
   * @param currentPage
   *    The page number to retrieve
   * @return Observable<PaginatedList<OpenaireBrokerTopicObject>>
   *    The list of OpenAIRE Broker topics.
   */
  public getTopics(elementsPerPage, currentPage): Observable<PaginatedList<OpenaireBrokerTopicObject>> {
    const sortOptions = new SortOptions('name', SortDirection.ASC);

    const findListOptions: FindListOptions = {
      elementsPerPage: elementsPerPage,
      currentPage: currentPage,
      sort: sortOptions
    };

    return this.openaireBrokerTopicRestService.getTopics(findListOptions).pipe(
      find((rd: RemoteData<PaginatedList<OpenaireBrokerTopicObject>>) => !rd.isResponsePending),
      map((rd: RemoteData<PaginatedList<OpenaireBrokerTopicObject>>) => {
        if (rd.hasSucceeded) {
          return rd.payload;
        } else {
          throw new Error('Can\'t retrieve OpenAIRE Broker topics from the Broker topics REST service');
        }
      })
    );
  }
}
