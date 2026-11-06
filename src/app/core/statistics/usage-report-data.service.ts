import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { dataService } from '../cache/builders/build-decorators';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { RequestParam } from '../cache/models/request-param.model';
import { ObjectCacheService } from '../cache/object-cache.service';
import { IdentifiableDataService } from '../data/base/identifiable-data.service';
import {
  SearchData,
  SearchDataImpl,
} from '../data/base/search-data';
import { FindListOptions } from '../data/find-list-options.model';
import { PaginatedList } from '../data/paginated-list.model';
import { RemoteData } from '../data/remote-data';
import { RequestService } from '../data/request.service';
import { FollowLinkConfig } from '../shared/follow-link-config.model';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import {
  getFirstCompletedRemoteData,
  getFirstSucceededRemoteData,
  getRemoteDataPayload,
} from '../shared/operators';
import { UsageReport } from './models/usage-report.model';
import { USAGE_REPORT } from './models/usage-report.resource-type';

/**
 * A service to retrieve {@link UsageReport}s from the REST API
 */
@Injectable({ providedIn: 'root' })
@dataService(USAGE_REPORT)
export class UsageReportDataService extends IdentifiableDataService<UsageReport> implements SearchData<UsageReport> {
  private searchData: SearchDataImpl<UsageReport>;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected halService: HALEndpointService,
    protected objectCache: ObjectCacheService,
  ) {
    super('usagereports', requestService, rdbService, objectCache, halService);

    this.searchData = new SearchDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.responseMsToLive);
  }

  getStatistic(scope: string, type: string): Observable<UsageReport> {
    return this.findById(`${scope}_${type}`).pipe(
      getFirstSucceededRemoteData(),
      getRemoteDataPayload(),
    );
  }

  searchStatistics(uri: string, page: number, size: number, categoryId?: string, startDate?: string, endDate?: string, excludePoints = false): Observable<UsageReport[]> {
    const params = [
      new RequestParam('uri', uri),
      new RequestParam('category', categoryId),
    ];

    if (startDate !== undefined) {
      params.push(
        new RequestParam('startDate', startDate),
      );
    }

    if (endDate !== undefined) {
      params.push(
        new RequestParam('endDate', endDate),
      );
    }

    if (excludePoints) {
      params.push(new RequestParam('projection', 'excludeUsageReportPoints'));
    }

    return this.searchBy('object', {
      searchParams: params,
      currentPage: page,
      elementsPerPage: size,
    }, true, false).pipe(
      getRemoteDataPayload(),
      map((list) => list.page),
    );
  }

  /**
   * Retrieve a single {@link UsageReport} by id, applying the selected startDate/endDate
   * filters. This uses the `findReport` search method which (unlike the plain `findById`/self
   * link lookup) correctly honours the date range filter server-side.
   *
   * @param reportId the report id (e.g. `{dsoUuid}_{reportType}`)
   * @param startDate the start date filter (optional)
   * @param endDate the end date filter (optional)
   */
  findReport(reportId: string, startDate?: string, endDate?: string): Observable<RemoteData<UsageReport>> {
    const params = [
      new RequestParam('id', reportId),
    ];

    if (startDate !== undefined && startDate !== null) {
      params.push(
        new RequestParam('startDate', startDate),
      );
    }

    if (endDate !== undefined && endDate !== null) {
      params.push(
        new RequestParam('endDate', endDate),
      );
    }

    const href$ = this.searchData.getSearchByHref('report', {
      searchParams: params,
    });

    return this.findByHref(href$, false, true).pipe(
      getFirstCompletedRemoteData(),
    );
  }

  public searchBy(searchMethod: string, options?: FindListOptions, useCachedVersionIfAvailable?: boolean, reRequestOnStale?: boolean, ...linksToFollow: FollowLinkConfig<UsageReport>[]): Observable<RemoteData<PaginatedList<UsageReport>>> {
    return this.searchData.searchBy(searchMethod, options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow).pipe(
      getFirstSucceededRemoteData(),
    );
  }
}
