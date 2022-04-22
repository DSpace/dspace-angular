/* eslint-disable max-classes-per-file */

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
import { WorkflowOwnerStatistics } from './models/workflow-owner-statistics.model';
import { WORKFLOW_OWNER_STATISTICS } from './models/workflow-owner-statistics.resource-type';

/**
 * A private DataService implementation to delegate specific methods to.
 */
 class WorkflowOwnerStatisticsServiceImpl extends DataService<WorkflowOwnerStatistics> {
  protected linkPath = 'workflowOwners';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DefaultChangeAnalyzer<WorkflowOwnerStatistics>) {
    super();
  }

}

/**
 * A service that provides methods to make REST requests with workflow owner statistics endpoint.
 */
 @Injectable()
 @dataService(WORKFLOW_OWNER_STATISTICS)
 export class WorkflowOwnerStatisticsService {

  dataService: WorkflowOwnerStatisticsServiceImpl;

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
    protected comparator: DefaultChangeAnalyzer<WorkflowOwnerStatistics>,
    protected itemService: ItemDataService,
    protected configurationService: ConfigurationDataService ) {

    this.dataService = new WorkflowOwnerStatisticsServiceImpl(requestService, rdbService, store, objectCache, halService,
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

    return this.dataService.searchBy('byDateRange', {
      elementsPerPage : limit,
      searchParams: searchParams
    }, false);

  }
}
