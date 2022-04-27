import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { dataService } from '../cache/builders/build-decorators';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { Community } from '../shared/community.model';
import { COMMUNITY } from '../shared/community.resource-type';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { ComColDataService } from './comcol-data.service';
import { DSOChangeAnalyzer } from './dso-change-analyzer.service';
import { PaginatedList } from './paginated-list.model';
import { RemoteData } from './remote-data';
import { RequestService } from './request.service';
import { BitstreamDataService } from './bitstream-data.service';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { isNotEmpty } from '../../shared/empty.util';
import { CoreState } from '../core-state.model';
import { FindListOptions } from './find-list-options.model';

@Injectable()
@dataService(COMMUNITY)
export class CommunityDataService extends ComColDataService<Community> {
  protected linkPath = 'communities';
  protected topLinkPath = 'search/top';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected bitstreamDataService: BitstreamDataService,
    protected http: HttpClient,
    protected comparator: DSOChangeAnalyzer<Community>
  ) {
    super();
  }

  getEndpoint() {
    return this.halService.getEndpoint(this.linkPath);
  }

  findTop(options: FindListOptions = {}, ...linksToFollow: FollowLinkConfig<Community>[]): Observable<RemoteData<PaginatedList<Community>>> {
    const hrefObs = this.getFindAllHref(options, this.topLinkPath);
    return this.findAllByHref(hrefObs, undefined, true, true, ...linksToFollow);
  }

  protected getFindByParentHref(parentUUID: string): Observable<string> {
    return this.halService.getEndpoint(this.linkPath).pipe(
      switchMap((communityEndpointHref: string) =>
        this.halService.getEndpoint('subcommunities', `${communityEndpointHref}/${parentUUID}`))
    );
  }

  protected getScopeCommunityHref(options: FindListOptions) {
    return this.getEndpoint().pipe(
      map((endpoint: string) => this.getIDHref(endpoint, options.scopeID)),
      filter((href: string) => isNotEmpty(href)),
      take(1)
    );
  }
}
