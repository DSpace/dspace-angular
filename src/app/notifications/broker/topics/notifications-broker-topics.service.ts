import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { find, map } from 'rxjs/operators';
import { NotificationsBrokerTopicRestService } from '../../../core/notifications/broker/topics/notifications-broker-topic-rest.service';
import { SortDirection, SortOptions } from '../../../core/cache/models/sort-options.model';
import { FindListOptions } from '../../../core/data/request.models';
import { RemoteData } from '../../../core/data/remote-data';
import { PaginatedList } from '../../../core/data/paginated-list.model';
import { NotificationsBrokerTopicObject } from '../../../core/notifications/broker/models/notifications-broker-topic.model';

/**
 * The service handling all Notifications Broker topic requests to the REST service.
 */
@Injectable()
export class NotificationsBrokerTopicsService {

  /**
   * Initialize the service variables.
   * @param {NotificationsBrokerTopicRestService} notificationsBrokerTopicRestService
   */
  constructor(
    private notificationsBrokerTopicRestService: NotificationsBrokerTopicRestService
  ) { }

  /**
   * Return the list of Notifications Broker topics managing pagination and errors.
   *
   * @param elementsPerPage
   *    The number of the topics per page
   * @param currentPage
   *    The page number to retrieve
   * @return Observable<PaginatedList<NotificationsBrokerTopicObject>>
   *    The list of Notifications Broker topics.
   */
  public getTopics(elementsPerPage, currentPage): Observable<PaginatedList<NotificationsBrokerTopicObject>> {
    const sortOptions = new SortOptions('name', SortDirection.ASC);

    const findListOptions: FindListOptions = {
      elementsPerPage: elementsPerPage,
      currentPage: currentPage,
      sort: sortOptions
    };

    return this.notificationsBrokerTopicRestService.getTopics(findListOptions).pipe(
      find((rd: RemoteData<PaginatedList<NotificationsBrokerTopicObject>>) => !rd.isResponsePending),
      map((rd: RemoteData<PaginatedList<NotificationsBrokerTopicObject>>) => {
        if (rd.hasSucceeded) {
          return rd.payload;
        } else {
          throw new Error('Can\'t retrieve Notifications Broker topics from the Broker topics REST service');
        }
      })
    );
  }
}
