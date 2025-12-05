import { Injectable } from '@angular/core';
import {
  map,
  Observable,
} from 'rxjs';

import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { BibliographyData } from '../shared/bibliography/bibliography-data.model';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { Item } from '../shared/item.model';
import { getFirstCompletedRemoteData } from '../shared/operators';
import { BaseDataService } from './base/base-data.service';
import { RequestService } from './request.service';




@Injectable({ providedIn: 'root' })
export class ItemBibliographyService extends BaseDataService<BibliographyData> {

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
  ) {
    super('bibliographies', requestService, rdbService, objectCache, halService);
  }

  getBibliographies(item: Item): Observable<BibliographyData> {
    return this.findByHref(item._links.bibliography.href).pipe(
      getFirstCompletedRemoteData(),
      map(res => res.payload),
    );
  }
}
