import { WorkflowAction } from '../tasks/models/workflow-action-object.model';
import { RequestService } from './request.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { Injectable } from '@angular/core';
import { WORKFLOW_ACTION } from '../tasks/models/workflow-action-object.resource-type';
import { BaseDataService } from './base/base-data.service';
import { dataService } from './base/data-service.decorator';

/**
 * A service responsible for fetching/sending data from/to the REST API on the workflowactions endpoint
 */
@Injectable()
@dataService(WORKFLOW_ACTION)
export class WorkflowActionDataService extends BaseDataService<WorkflowAction> {
  protected linkPath = 'workflowactions';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
  ) {
    super('workflowactions', requestService, rdbService, objectCache, halService);
  }
}
