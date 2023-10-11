import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { NotificationsService } from '../../shared/notifications/notifications.service';
import { dataService } from '../data/base/data-service.decorator';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { RequestParam } from '../cache/models/request-param.model';
import { ObjectCacheService } from '../cache/object-cache.service';
import { PaginatedList } from '../data/paginated-list.model';
import { RemoteData } from '../data/remote-data';
import { RequestService } from '../data/request.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { LoginStatistics } from './models/login-statistics.model';
import { LOGIN_STATISTICS } from './models/login-statistics.resource-type';
import { SearchDataImpl } from '../data/base/search-data';
import { IdentifiableDataService } from '../data/base/identifiable-data.service';

/**
 * A service that provides methods to make REST requests with login statistics endpoint.
 */
@Injectable()
@dataService(LOGIN_STATISTICS)
export class LoginStatisticsService extends IdentifiableDataService<LoginStatistics> {

  private searchData: SearchDataImpl<LoginStatistics>;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService) {

    super('logins', requestService, rdbService, objectCache, halService);
    this.searchData = new SearchDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.responseMsToLive);

  }

  /**
   * Search for login statistics in the given date range.
   *
   * @param startDate the start date
   * @param endDate the end date
   * @param limit the limit to apply
   */
  searchByDateRange(startDate: string, endDate: string, limit: number): Observable<RemoteData<PaginatedList<LoginStatistics>>> {

    const searchParams: RequestParam[] = [];
    if (startDate) {
      searchParams.push(new RequestParam('startDate', startDate));
    }

    if (endDate) {
      searchParams.push(new RequestParam('endDate', endDate));
    }

    if (!limit) {
      limit = 10;
    }

    return this.searchData.searchBy('byDateRange', {
      elementsPerPage: limit,
      searchParams: searchParams
    }, false);

  }
}
