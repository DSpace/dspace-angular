import { Inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { DataService } from './data.service';
import { Collection } from '../shared/collection.model';
import { ObjectCacheService } from '../cache/object-cache.service';
import { ResponseCacheService } from '../cache/response-cache.service';
import { NormalizedCollection } from '../cache/models/normalized-collection.model';
import { CoreState } from '../core.reducers';
import { RequestService } from './request.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { GLOBAL_CONFIG, GlobalConfig } from '../../../config';

@Injectable()
export class CollectionDataService extends DataService<NormalizedCollection, Collection> {
  protected resourceEndpoint = '/core/collections';
  protected browseEndpoint = '/discover/browses/dateissued/collections';

  constructor(
    protected objectCache: ObjectCacheService,
    protected responseCache: ResponseCacheService,
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    @Inject(GLOBAL_CONFIG) EnvConfig: GlobalConfig
  ) {
    super(NormalizedCollection, EnvConfig);
  }

}
