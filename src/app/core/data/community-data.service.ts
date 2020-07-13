import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, switchMap, take } from 'rxjs/operators';
import { hasValue } from '../../shared/empty.util';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { dataService } from '../cache/builders/build-decorators';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { CoreState } from '../core.reducers';
import { Community } from '../shared/community.model';
import { COMMUNITY } from '../shared/community.resource-type';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { ComColDataService } from './comcol-data.service';
import { DSOChangeAnalyzer } from './dso-change-analyzer.service';
import { PaginatedList } from './paginated-list';
import { RemoteData } from './remote-data';
import { FindListOptions, FindListRequest } from './request.models';
import { RequestService } from './request.service';

@Injectable()
@dataService(COMMUNITY)
export class CommunityDataService extends ComColDataService<Community> {
  protected linkPath = 'communities';
  protected topLinkPath = 'search/top';
  protected cds = this;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DSOChangeAnalyzer<Community>
  ) {
    super();
  }

  getEndpoint() {
    return this.halService.getEndpoint(this.linkPath);
  }

  findTop(options: FindListOptions = {}): Observable<RemoteData<PaginatedList<Community>>> {
    const hrefObs = this.getFindAllHref(options, this.topLinkPath);
    hrefObs.pipe(
      filter((href: string) => hasValue(href)),
      take(1))
      .subscribe((href: string) => {
        const request = new FindListRequest(this.requestService.generateRequestId(), href, options);
        this.requestService.configure(request);
      });

    return this.rdbService.buildList<Community>(hrefObs) as Observable<RemoteData<PaginatedList<Community>>>;
  }

  protected getFindByParentHref(parentUUID: string): Observable<string> {
    return this.halService.getEndpoint(this.linkPath).pipe(
      switchMap((communityEndpointHref: string) =>
        this.halService.getEndpoint('subcommunities', `${communityEndpointHref}/${parentUUID}`))
    );
  }

}
