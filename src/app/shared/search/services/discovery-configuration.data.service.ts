/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
import { Injectable } from '@angular/core';
import { dataService } from '@dspace/core/cache/builders/build-decorators';
import { RemoteDataBuildService } from '@dspace/core/cache/builders/remote-data-build.service';
import { ObjectCacheService } from '@dspace/core/cache/object-cache.service';
import { IdentifiableDataService } from '@dspace/core/data/base/identifiable-data.service';
import { RemoteData } from '@dspace/core/data/remote-data';
import { RequestService } from '@dspace/core/data/request.service';
import { HALEndpointService } from '@dspace/core/shared/hal-endpoint.service';
import { DiscoveryConfiguration } from '@dspace/core/shared/search/discovery-configuration.model';
import { DISCOVERY_CONFIGURATION } from '@dspace/core/shared/search/types/discovery-configuration.resource-type';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { isNotEmpty } from '../../../utils/empty.util';

/**
 * Data service for retrieving Discovery configurations from the REST API.
 */
@Injectable({ providedIn: 'root' })
@dataService(DISCOVERY_CONFIGURATION)
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
      map((endpoint) => this.buildHrefFromFindOptions(this.constructIdEndpoint(endpoint, 'scope'), { scopeID }, [], ...linksToFollow)),
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
