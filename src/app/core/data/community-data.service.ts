import { Inject, Injectable } from '@angular/core';

import { Store } from '@ngrx/store';

import { DataService } from './data.service';
import { Community } from '../shared/community.model';
import { ObjectCacheService } from '../cache/object-cache.service';
import { ResponseCacheService } from '../cache/response-cache.service';
import { NormalizedCommunity } from '../cache/models/normalized-community.model';
import { CoreState } from '../core.reducers';
import { RequestService } from './request.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { GLOBAL_CONFIG, GlobalConfig } from '../../../config';

@Injectable()
export class CommunityDataService extends DataService<NormalizedCommunity, Community> {
  protected resourceEndpoint = '/core/communities';
  protected browseEndpoint = '/discover/browses/dateissued/communities';

  constructor(
    protected objectCache: ObjectCacheService,
    protected responseCache: ResponseCacheService,
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    @Inject(GLOBAL_CONFIG) EnvConfig: GlobalConfig
  ) {
    super(NormalizedCommunity, EnvConfig);
  }

}
