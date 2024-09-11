import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { RequestParam } from '../cache/models/request-param.model';
import { ObjectCacheService } from '../cache/object-cache.service';
import { IdentifiableDataService } from '../data/base/identifiable-data.service';
import { SearchDataImpl } from '../data/base/search-data';
import { PaginatedList } from '../data/paginated-list.model';
import { RemoteData } from '../data/remote-data';
import { RequestService } from '../data/request.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { WorkflowOwnerStatistics } from './models/workflow-owner-statistics.model';

/**
 * A service that provides methods to make REST requests with workflow owner statistics endpoint.
 */
@Injectable({ providedIn: 'root' })
export class WorkflowOwnerStatisticsDataService extends IdentifiableDataService<WorkflowOwnerStatistics> {

  protected linkPath = 'workflowOwners';

  private searchData: SearchDataImpl<WorkflowOwnerStatistics>;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
  ) {
    super('workflowOwners', requestService, rdbService, objectCache, halService);

    this.searchData = new SearchDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.responseMsToLive);
  }

  /**
   * Search for the workflow step by the given filters.
   *
   * @param startDate the start date
   * @param endDate the end date
   * @param collectionId the collection id
   * @param limit the limit to apply
   */
  searchByDateRange(startDate: string, endDate: string, collectionId: string, limit: number): Observable<RemoteData<PaginatedList<WorkflowOwnerStatistics>>> {

    const searchParams: RequestParam[] = [];
    if (startDate) {
      searchParams.push(new RequestParam('startDate', startDate));
    }

    if (endDate) {
      searchParams.push(new RequestParam('endDate', endDate));
    }

    if (collectionId) {
      searchParams.push(new RequestParam('collection', collectionId));
    }

    if (!limit) {
      limit = 10;
    }

    return this.searchData.searchBy('byDateRange', {
      elementsPerPage: limit,
      searchParams: searchParams,
    }, false);

  }
}
