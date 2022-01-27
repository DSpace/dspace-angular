import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { NotificationsService } from '../../../app/shared/notifications/notifications.service';
import { dataService } from '../cache/builders/build-decorators';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { RequestParam } from '../cache/models/request-param.model';
import { ObjectCacheService } from '../cache/object-cache.service';
import { CoreState } from '../core.reducers';
import { ConfigurationDataService } from '../data/configuration-data.service';
import { DataService } from '../data/data.service';
import { DefaultChangeAnalyzer } from '../data/default-change-analyzer.service';
import { ItemDataService } from '../data/item-data.service';
import { PaginatedList } from '../data/paginated-list.model';
import { RemoteData } from '../data/remote-data';
import { RequestService } from '../data/request.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { LoginStatistics } from './models/login-statistics.model';
import { LOGIN_STATISTICS } from './models/login-statistics.resource-type';

/* tslint:disable:max-classes-per-file */

/**
 * A private DataService implementation to delegate specific methods to.
 */
 class LoginStatisticsServiceImpl extends DataService<LoginStatistics> {
  protected linkPath = 'logins';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DefaultChangeAnalyzer<LoginStatistics>) {
    super();
  }

}

/**
 * A service that provides methods to make REST requests with login statistics endpoint.
 */
 @Injectable()
 @dataService(LOGIN_STATISTICS)
 export class LoginStatisticsService {

  dataService: LoginStatisticsServiceImpl;

  responseMsToLive: number = 10 * 1000;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected router: Router,
    protected comparator: DefaultChangeAnalyzer<LoginStatistics>,
    protected itemService: ItemDataService,
    protected configurationService: ConfigurationDataService ) {

    this.dataService = new LoginStatisticsServiceImpl(requestService, rdbService, store, objectCache, halService,
        notificationsService, http, comparator);

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

    return this.dataService.searchBy('byDateRange', {
      elementsPerPage : limit,
      searchParams: searchParams
    }, false);

  }
}
