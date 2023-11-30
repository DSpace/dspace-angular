import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { dataService } from '../data/base/data-service.decorator';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { RequestService } from '../data/request.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { RemoteData } from '../data/remote-data';
import { MetadataSecurityConfiguration } from './models/metadata-security-configuration';
import { IdentifiableDataService } from '../data/base/identifiable-data.service';
import { METADATA_SECURITY_TYPE } from './models/metadata-security-config.resource-type';

/**
 * A service that provides methods to make REST requests with securitysettings endpoint.
 */
@Injectable({
  providedIn: 'root'
})
@dataService(METADATA_SECURITY_TYPE)
export class MetadataSecurityConfigurationService extends IdentifiableDataService<MetadataSecurityConfiguration> {

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService
  ) {
    super('securitysettings', requestService, rdbService, objectCache, halService);
  }

  /**
   * It provides the configuration for metadata security
   * @param entityType
   */
  findById(entityType: string): Observable<RemoteData<MetadataSecurityConfiguration>> {
    return super.findById(entityType);
  }
}

