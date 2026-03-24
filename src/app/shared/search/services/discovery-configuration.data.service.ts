/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
import { Injectable } from '@angular/core';

import { RemoteDataBuildService } from '../../../core/cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../../../core/cache/object-cache.service';
import { IdentifiableDataService } from '../../../core/data/base/identifiable-data.service';
import { RequestService } from '../../../core/data/request.service';
import { HALEndpointService } from '../../../core/shared/hal-endpoint.service';
import { DiscoveryConfiguration } from '../models/discovery-configuration.model';
import { Observable } from 'rxjs';
import { RemoteData } from '../../../core/data/remote-data';
import { map } from 'rxjs/operators';
import { isNotEmpty } from '../../empty.util';

/**
 * Data service for retrieving Discovery configurations from the REST API.
 */
@Injectable({ providedIn: 'root' })
export class DiscoveryConfigurationDataService extends IdentifiableDataService<DiscoveryConfiguration> {

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
  ) {
    super('discoveryconfigurations', requestService, rdbService, objectCache, halService);
  }

  findByScope(scopeID: string, useCachedVersionIfAvailable: boolean = true, reRequestOnStale: boolean = true, ...linksToFollow): Observable<RemoteData<DiscoveryConfiguration>> {
    const href$ = this.getEndpoint().pipe(
      map((endpoint) => this.buildHrefFromFindOptions(this.constructIdEndpoint(endpoint, 'scope'), { scopeID }, [], ...linksToFollow))
    );
    return this.findByHref(href$, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }

  findByIdOrScope(id: string, scopeID: string, useCachedVersionIfAvailable: boolean = true, reRequestOnStale: boolean = true, ...linksToFollow) {
    if (isNotEmpty(id)) {
      return this.findById(id, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
    } else {
      return this.findByScope(scopeID, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
    }
  }

}
