import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { dataService } from '../data/base/data-service.decorator';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { RequestParam } from '../cache/models/request-param.model';
import { ObjectCacheService } from '../cache/object-cache.service';
import { IdentifiableDataService } from '../data/base/identifiable-data.service';
import { PaginatedList } from '../data/paginated-list.model';
import { RemoteData } from '../data/remote-data';
import { RequestService } from '../data/request.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { WorkflowStepStatistics } from './models/workflow-step-statistics.model';
import { WORKFLOW_STEP_STATISTICS } from './models/workflow-step-statistics.resource-type';
import { SearchDataImpl } from '../data/base/search-data';

/**
 * A service that provides methods to make REST requests with workflow step statistics endpoint.
 */
@Injectable()
@dataService(WORKFLOW_STEP_STATISTICS)
export class WorkflowStepStatisticsDataService extends IdentifiableDataService<WorkflowStepStatistics> {

  protected linkPath = 'workflowSteps';

  private searchData: SearchDataImpl<WorkflowStepStatistics>;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService
  ) {
    super('workflowSteps', requestService, rdbService, objectCache, halService);

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
  searchByDateRange(startDate: string, endDate: string, collectionId: string, limit: number): Observable<RemoteData<PaginatedList<WorkflowStepStatistics>>> {

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
      searchParams: searchParams
    }, false);

  }

  /**
   * Search for the current workflow steps.
   */
  searchCurrent(): Observable<RemoteData<PaginatedList<WorkflowStepStatistics>>> {
    return this.searchData.searchBy('current');
  }
}
