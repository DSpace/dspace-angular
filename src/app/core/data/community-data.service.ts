import { filter, mergeMap, take } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { NormalizedCommunity } from '../cache/models/normalized-community.model';
import { ObjectCacheService } from '../cache/object-cache.service';
import { CoreState } from '../core.reducers';
import { Community } from '../shared/community.model';
import { ComColDataService } from './comcol-data.service';
import { RequestService } from './request.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { AuthService } from '../auth/auth.service';
import { FindAllOptions, FindAllRequest } from './request.models';
import { RemoteData } from './remote-data';
import { hasValue, isNotEmpty } from '../../shared/empty.util';
import { Observable } from 'rxjs';
import { PaginatedList } from './paginated-list';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { HttpClient } from '@angular/common/http';
import { DataBuildService } from '../cache/builders/data-build.service';
import { DSOUpdateComparator } from './dso-update-comparator';

@Injectable()
export class CommunityDataService extends ComColDataService<NormalizedCommunity, Community> {
  protected linkPath = 'communities';
  protected topLinkPath = 'communities/search/top';
  protected cds = this;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected dataBuildService: DataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected authService: AuthService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DSOUpdateComparator
  ) {
    super();
  }

  getEndpoint() {
    return this.halService.getEndpoint(this.linkPath);
  }

  findTop(options: FindAllOptions = {}): Observable<RemoteData<PaginatedList<Community>>> {
    const hrefObs = this.getFindAllHref(options, this.topLinkPath);
    hrefObs.pipe(
      filter((href: string) => hasValue(href)),
      take(1))
      .subscribe((href: string) => {
        const request = new FindAllRequest(this.requestService.generateRequestId(), href, options);
        this.requestService.configure(request);
      });

    return this.rdbService.buildList<NormalizedCommunity, Community>(hrefObs) as Observable<RemoteData<PaginatedList<Community>>>;
  }
}
