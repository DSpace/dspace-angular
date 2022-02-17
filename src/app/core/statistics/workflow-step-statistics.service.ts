import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { NotificationsService } from '../../shared/notifications/notifications.service';
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
import { WorkflowStepStatistics } from './models/workflow-step-statistics.model';
import { WORKFLOW_STEP_STATISTICS } from './models/workflow-step-statistics.resource-type';

/* tslint:disable:max-classes-per-file */

/**
 * A private DataService implementation to delegate specific methods to.
 */
 class WorkflowStepStatisticsServiceImpl extends DataService<WorkflowStepStatistics> {
  protected linkPath = 'workflowSteps';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DefaultChangeAnalyzer<WorkflowStepStatistics>) {
    super();
  }

}

/**
 * A service that provides methods to make REST requests with workflow step statistics endpoint.
 */
 @Injectable()
 @dataService(WORKFLOW_STEP_STATISTICS)
 export class WorkflowStepStatisticsService {

  dataService: WorkflowStepStatisticsServiceImpl;

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
    protected comparator: DefaultChangeAnalyzer<WorkflowStepStatistics>,
    protected itemService: ItemDataService,
    protected configurationService: ConfigurationDataService ) {

    this.dataService = new WorkflowStepStatisticsServiceImpl(requestService, rdbService, store, objectCache, halService,
        notificationsService, http, comparator);

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

    return this.dataService.searchBy('byDateRange', {
      elementsPerPage : limit,
      searchParams: searchParams
    }, false);

  }

  /**
   * Search for the current workflow steps.
   */
  searchCurrent(): Observable<RemoteData<PaginatedList<WorkflowStepStatistics>>> {
    return this.dataService.searchBy('current');
  }
}
