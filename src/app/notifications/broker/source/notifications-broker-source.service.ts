import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { find, map } from 'rxjs/operators';
import { NotificationsBrokerSourceRestService } from '../../../core/notifications/broker/source/notifications-broker-source-rest.service';
import { SortDirection, SortOptions } from '../../../core/cache/models/sort-options.model';
import { FindListOptions } from '../../../core/data/request.models';
import { RemoteData } from '../../../core/data/remote-data';
import { PaginatedList } from '../../../core/data/paginated-list.model';
import { NotificationsBrokerSourceObject } from '../../../core/notifications/broker/models/notifications-broker-source.model';

/**
 * The service handling all Notifications Broker source requests to the REST service.
 */
@Injectable()
export class NotificationsBrokerSourceService {

  /**
   * Initialize the service variables.
   * @param {NotificationsBrokerSourceRestService} notificationsBrokerSourceRestService
   */
  constructor(
    private notificationsBrokerSourceRestService: NotificationsBrokerSourceRestService
  ) { }

  /**
   * Return the list of Notifications Broker source managing pagination and errors.
   *
   * @param elementsPerPage
   *    The number of the source per page
   * @param currentPage
   *    The page number to retrieve
   * @return Observable<PaginatedList<NotificationsBrokerSourceObject>>
   *    The list of Notifications Broker source.
   */
  public getSources(elementsPerPage, currentPage): Observable<PaginatedList<NotificationsBrokerSourceObject>> {
    const sortOptions = new SortOptions('name', SortDirection.ASC);

    const findListOptions: FindListOptions = {
      elementsPerPage: elementsPerPage,
      currentPage: currentPage,
      sort: sortOptions
    };

    return this.notificationsBrokerSourceRestService.getSources(findListOptions).pipe(
      find((rd: RemoteData<PaginatedList<NotificationsBrokerSourceObject>>) => !rd.isResponsePending),
      map((rd: RemoteData<PaginatedList<NotificationsBrokerSourceObject>>) => {
        if (rd.hasSucceeded) {
          return rd.payload;
        } else {
          throw new Error('Can\'t retrieve Notifications Broker source from the Broker source REST service');
        }
      })
    );
  }
}
