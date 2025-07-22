import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { RemoteDataBuildService , RequestParam , ObjectCacheService } from '../cache';
import { IdentifiableDataService ,
  SearchData,
  SearchDataImpl,
, FindListOptions , FollowLinkConfig , PaginatedList , RemoteData , RequestService } from '../data';
import { HALEndpointService ,
  getFirstSucceededRemoteData,
  getRemoteDataPayload,
} from '../shared';
import { UsageReport } from './models';

/**
 * A service to retrieve {@link UsageReport}s from the REST API
 */
@Injectable({ providedIn: 'root' })
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

  searchStatistics(uri: string, page: number, size: number): Observable<UsageReport[]> {
    return this.searchBy('object', {
      searchParams: [
        new RequestParam('uri', uri),
      ],
      currentPage: page,
      elementsPerPage: size,
    }, true, false).pipe(
      getFirstSucceededRemoteData(),
      getRemoteDataPayload(),
      map((list) => list.page),
    );
  }

  public searchBy(searchMethod: string, options?: FindListOptions, useCachedVersionIfAvailable?: boolean, reRequestOnStale?: boolean, ...linksToFollow: FollowLinkConfig<UsageReport>[]): Observable<RemoteData<PaginatedList<UsageReport>>> {
    return this.searchData.searchBy(searchMethod, options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }
}
