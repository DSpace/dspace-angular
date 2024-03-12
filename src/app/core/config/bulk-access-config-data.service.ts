import { Injectable } from '@angular/core';

import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { RequestService } from '../data/request.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { ConfigDataService } from './config-data.service';

/**
 * Data Service responsible for retrieving Bulk Access Condition Options from the REST API
 */
@Injectable({ providedIn: 'root' })
export class BulkAccessConfigDataService extends ConfigDataService {

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
  ) {
    super('bulkaccessconditionoptions', requestService, rdbService, objectCache, halService);
  }

}
