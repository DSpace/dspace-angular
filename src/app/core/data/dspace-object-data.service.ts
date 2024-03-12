import { Injectable } from '@angular/core';

import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { DSpaceObject } from '../shared/dspace-object.model';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { IdentifiableDataService } from './base/identifiable-data.service';
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
