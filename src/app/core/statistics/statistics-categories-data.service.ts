import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { dataService } from '../data/base/data-service.decorator';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { IdentifiableDataService } from '../data/base/identifiable-data.service';
import { RequestService } from '../data/request.service';
import { STATISTICS_CATEGORY } from './models/statistics-category.resource-type';
import { StatisticsCategory } from './models/statistics-category.model';
import { SearchDataImpl } from '../data/base/search-data';
import { RemoteData } from '../data/remote-data';
import { FindListOptions } from '../data/find-list-options.model';
import { PaginatedList } from '../data/paginated-list.model';

/**
 * A service to retrieve {@link StatisticsCategory}s from the REST API
 */
@Injectable()
@dataService(STATISTICS_CATEGORY)
export class StatisticsCategoriesDataService extends IdentifiableDataService<StatisticsCategory> {

  protected linkPath = 'categories';

  private searchData: SearchDataImpl<StatisticsCategory>;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService
  ) {
    super('categories', requestService, rdbService, objectCache, halService);

    this.searchData = new SearchDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.responseMsToLive);
  }

  getStatistic(scope: string, type: string): Observable<RemoteData<StatisticsCategory>> {
    return this.findById(`${scope}_${type}`);
  }

  getCategoriesStatistics(uri: string, page: number, size: number, startDate?: string, endDate?: string): Observable<RemoteData<PaginatedList<StatisticsCategory>>> {
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

    const options = Object.assign(new FindListOptions(), {
      searchParams: params,
      currentPage: page,
      elementsPerPage: size,
    });
    return this.searchData.searchBy('object', options, false);
  }

}
