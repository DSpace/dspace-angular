import { Injectable } from '@angular/core';

import {
  ObjectCacheService,
  RemoteDataBuildService,
} from '../cache';
import { RequestService } from '../data';
import { HALEndpointService } from '../shared';
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
