import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { dataService } from '../cache/builders/build-decorators';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { CoreState } from '../core.reducers';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { DataService } from '../data/data.service';
import { RequestService } from '../data/request.service';
import { DefaultChangeAnalyzer } from '../data/default-change-analyzer.service';
import { STATISTICS_CATEGORY } from './models/statistics-category.resource-type';
import { StatisticsCategory } from './models/statistics-category.model';
import { Observable } from 'rxjs';
import { getFirstSucceededRemoteData, getRemoteDataPayload } from '../shared/operators';
import { map } from 'rxjs/operators';


/**
 * A service to retrieve {@link StatisticsCategory}s from the REST API
 */
@Injectable()
@dataService(STATISTICS_CATEGORY)
export class StatisticsCategoriesService extends DataService<StatisticsCategory> {

  protected linkPath = 'categories';

  constructor(
    protected comparator: DefaultChangeAnalyzer<StatisticsCategory>,
    protected halService: HALEndpointService,
    protected http: HttpClient,
    protected notificationsService: NotificationsService,
    protected objectCache: ObjectCacheService,
    protected rdbService: RemoteDataBuildService,
    protected requestService: RequestService,
    protected store: Store<CoreState>,
  ) {
    super();
  }

  getStatistic(scope: string, type: string): Observable<StatisticsCategory> {
    return this.findById(`${scope}_${type}`).pipe(
      getFirstSucceededRemoteData(),
      getRemoteDataPayload(),
    );
  }

  getCategoriesStatistics(uri: string, page: number, size: number, startDate?: string, endDate?: string): Observable<StatisticsCategory[]> {
    const params = [
      {
        fieldName: `uri`,
        fieldValue: uri,
      }
    ];

    if (startDate !== undefined) {
      params.push({
        fieldName: `startDate`,
        fieldValue: startDate,
      });
    }

    if (endDate !== undefined) {
      params.push({
        fieldName: `endDate`,
        fieldValue: endDate,
      });
    }

    return this.searchBy('object', {
      searchParams: params,
      currentPage: page,
      elementsPerPage: size,
    }, false).pipe(
      getFirstSucceededRemoteData(),
      getRemoteDataPayload(),
      map((list) => list.page),
    );
  }

}
