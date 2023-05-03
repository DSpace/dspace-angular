import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { RemoteData } from './remote-data';
import { RequestService } from './request.service';
import { IdentifiableDataService } from './base/identifiable-data.service';
import { BulkAccessConditionOptions } from '../shared/bulk-access-condition-options.model';

@Injectable()
/**
 * Data Service responsible for retrieving Bulk Access Condition Options from the REST API
 */
export class BulkAccessConditionOptionsService extends IdentifiableDataService<BulkAccessConditionOptions> {

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
  ) {
    super('bulkaccessconditionoptions', requestService, rdbService, objectCache, halService);
  }

  getAll(): Observable<RemoteData<BulkAccessConditionOptions>> {
    return this.findByHref(this.halService.getEndpoint(this.linkPath));
  }

  // findByPropertyName(name: string): Observable<RemoteData<BulkAccessConditionOptions>> {
  //   return this.findById(name);
  // }
}
