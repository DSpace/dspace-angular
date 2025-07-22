import { Injectable } from '@angular/core';

import {
  ObjectCacheService,
  RemoteDataBuildService,
} from '../cache';
import {
  DSpaceObject,
  HALEndpointService,
} from '../shared';
import { IdentifiableDataService } from './base';
import { RequestService } from './request.service';

@Injectable({ providedIn: 'root' })
export class DSpaceObjectDataService extends IdentifiableDataService<DSpaceObject> {
  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
  ) {
    super(
      'dso', requestService, rdbService, objectCache, halService, undefined,
      // interpolate uuid as query parameter
      (endpoint: string, resourceID: string): string => {
        return endpoint.replace(/{\?uuid}/, `?uuid=${resourceID}`);
      },
    );
  }
}
