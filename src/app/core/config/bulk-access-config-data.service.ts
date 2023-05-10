import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { RemoteData } from '../data/remote-data';
import { RequestService } from '../data/request.service';
import { BulkAccessConditionOptions } from './models/bulk-access-condition-options.model';
import { ConfigDataService } from './config-data.service';

@Injectable({ providedIn: 'root' })
/**
 * Data Service responsible for retrieving Bulk Access Condition Options from the REST API
 */
export class BulkAccessConfigDataService extends ConfigDataService {

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
  ) {
    super('bulkaccessconditionoptions', requestService, rdbService, objectCache, halService);
  }

  findByPropertyName(name: string): Observable<RemoteData<BulkAccessConditionOptions>> {
    return this.findById(name) as Observable<RemoteData<BulkAccessConditionOptions>>;
  }
}
