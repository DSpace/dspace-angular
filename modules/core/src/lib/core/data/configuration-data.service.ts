import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  ObjectCacheService,
  RemoteDataBuildService,
} from '../cache';
import {
  ConfigurationProperty,
  HALEndpointService,
} from '../shared';
import { IdentifiableDataService } from './base';
import { RemoteData } from './remote-data';
import { RequestService } from './request.service';

@Injectable({ providedIn: 'root' })
/**
 * Data Service responsible for retrieving Configuration properties
 */
export class ConfigurationDataService extends IdentifiableDataService<ConfigurationProperty> {

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
  ) {
    super('properties', requestService, rdbService, objectCache, halService);
  }

  /**
   * Finds a configuration property by name
   * @param name
   */
  findByPropertyName(name: string): Observable<RemoteData<ConfigurationProperty>> {
    return this.findById(name);
  }
}
