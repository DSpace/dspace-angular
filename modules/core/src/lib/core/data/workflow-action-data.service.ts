import { Injectable } from '@angular/core';

import {
  ObjectCacheService,
  RemoteDataBuildService,
} from '../cache';
import { HALEndpointService } from '../shared';
import { WorkflowAction } from '../tasks';
import { IdentifiableDataService } from './base';
import { RequestService } from './request.service';

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
