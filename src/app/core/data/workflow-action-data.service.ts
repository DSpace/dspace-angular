import { WorkflowAction } from '../tasks/models/workflow-action-object.model';
import { RequestService } from './request.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { Injectable } from '@angular/core';
import { IdentifiableDataService } from './base/identifiable-data.service';

/**
 * A service responsible for fetching/sending data from/to the REST API on the workflowactions endpoint
 */
@Injectable({ providedIn: 'root' })
export class WorkflowActionDataService extends IdentifiableDataService<WorkflowAction> {
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
