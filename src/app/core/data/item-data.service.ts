import { Inject, Injectable } from '@angular/core';

import { Store } from '@ngrx/store';

import { DataService } from './data.service';
import { Item } from '../shared/item.model';
import { ObjectCacheService } from '../cache/object-cache.service';
import { ResponseCacheService } from '../cache/response-cache.service';
import { CoreState } from '../core.reducers';
import { NormalizedItem } from '../cache/models/normalized-item.model';
import { RequestService } from './request.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { GLOBAL_CONFIG, GlobalConfig } from '../../../config';

@Injectable()
export class ItemDataService extends DataService<NormalizedItem, Item> {
  protected resourceEndpoint = '/core/items';
  protected browseEndpoint = '/discover/browses/dateissued/items';

  constructor(
    protected objectCache: ObjectCacheService,
    protected responseCache: ResponseCacheService,
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    @Inject(GLOBAL_CONFIG) EnvConfig: GlobalConfig
  ) {
    super(NormalizedItem, EnvConfig);
  }
}
