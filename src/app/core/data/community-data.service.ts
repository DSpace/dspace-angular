import { Inject, Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { GLOBAL_CONFIG, GlobalConfig } from '../../../config';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { NormalizedCommunity } from '../cache/models/normalized-community.model';
import { ObjectCacheService } from '../cache/object-cache.service';
import { ResponseCacheService } from '../cache/response-cache.service';
import { CoreState } from '../core.reducers';
import { Community } from '../shared/community.model';
import { ComColDataService } from './comcol-data.service';
import { RequestService } from './request.service';

@Injectable()
export class CommunityDataService extends ComColDataService<NormalizedCommunity, Community> {
  protected linkName = 'communities';
  protected cds = this;
  protected overrideRequest = false;

  constructor(
    protected responseCache: ResponseCacheService,
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    @Inject(GLOBAL_CONFIG) protected EnvConfig: GlobalConfig,
    protected objectCache: ObjectCacheService
  ) {
    super(NormalizedCommunity);
  }
}
