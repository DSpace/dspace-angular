import { Injectable } from '@angular/core';

import {
  ObjectCacheService,
  RemoteDataBuildService,
} from '../../cache';
import {
  Feature,
  HALEndpointService,
} from '../../shared';
import { BaseDataService } from '../base';
import { RequestService } from '../request.service';

/**
 * A service to retrieve {@link Feature}s from the REST API
 */
@Injectable({ providedIn: 'root' })
export class FeatureDataService extends BaseDataService<Feature> {
  protected linkPath = 'features';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
  ) {
    super('features', requestService, rdbService, objectCache, halService);
  }
}
