import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AccessStatusObject } from 'src/app/shared/object-collection/shared/badges/access-status-badge/access-status.model';

import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { Item } from '../shared/item.model';
import { BaseDataService } from './base/base-data.service';
import { RemoteData } from './remote-data';
import { RequestService } from './request.service';

/**
 * Data service responsible for retrieving the access status of Items
 */
@Injectable({ providedIn: 'root' })
export class AccessStatusDataService extends BaseDataService<AccessStatusObject> {

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
  ) {
    super('accessStatus', requestService, rdbService, objectCache, halService);
  }

  /**
   * Returns {@link RemoteData} of {@link AccessStatusObject} that is the access status of the given item
   * @param item Item we want the access status of
   */
  findItemAccessStatusFor(item: Item): Observable<RemoteData<AccessStatusObject>> {
    return this.findByHref(item._links.accessStatus.href);
  }
}
