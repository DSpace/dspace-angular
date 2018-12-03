import { Inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { GLOBAL_CONFIG, GlobalConfig } from '../../../config';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { NormalizedCollection } from '../cache/models/normalized-collection.model';
import { ObjectCacheService } from '../cache/object-cache.service';
import { ResponseCacheService } from '../cache/response-cache.service';
import { CoreState } from '../core.reducers';
import { Collection } from '../shared/collection.model';
import { ComColDataService } from './comcol-data.service';
import { CommunityDataService } from './community-data.service';
import { RequestService } from './request.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';

@Injectable()
export class CollectionDataService extends ComColDataService<NormalizedCollection, Collection> {
  protected linkPath = 'collections';

  constructor(
    protected responseCache: ResponseCacheService,
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected cds: CommunityDataService,
    protected halService: HALEndpointService,
    protected objectCache: ObjectCacheService
  ) {
    super();
  }
}
