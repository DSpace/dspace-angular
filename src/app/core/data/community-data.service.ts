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
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { AuthService } from '../auth/auth.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';

@Injectable()
export class CommunityDataService extends ComColDataService<NormalizedCommunity, Community> {
  protected linkPath = 'communities';
  protected cds = this;

  constructor(
    protected responseCache: ResponseCacheService,
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected authService: AuthService
  ) {
    super();
  }

  getEndpoint() {
    return this.halService.getEndpoint(this.linkPath);
  }

}
