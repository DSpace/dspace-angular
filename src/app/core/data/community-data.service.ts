import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { NormalizedCommunity } from '../cache/models/normalized-community.model';
import { ObjectCacheService } from '../cache/object-cache.service';
import { ResponseCacheService } from '../cache/response-cache.service';
import { CoreState } from '../core.reducers';
import { Community } from '../shared/community.model';
import { ComColDataService } from './comcol-data.service';
import { RequestService } from './request.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { FindAllOptions, FindAllRequest } from './request.models';
import { RemoteData } from './remote-data';
import { hasValue, isNotEmpty } from '../../shared/empty.util';
import { Observable } from 'rxjs/Observable';
import { PaginatedList } from './paginated-list';

@Injectable()
export class CommunityDataService extends ComColDataService<NormalizedCommunity, Community> {
  protected linkPath = 'communities';
  protected topLinkPath = 'communities/search/top';
  protected cds = this;

  constructor(
    protected responseCache: ResponseCacheService,
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService
  ) {
    super();
  }

  getEndpoint() {
    return this.halService.getEndpoint(this.linkPath);
  }

  findTop(options: FindAllOptions = {}): Observable<RemoteData<PaginatedList<Community>>> {
    const hrefObs = this.halService.getEndpoint(this.topLinkPath).filter((href: string) => isNotEmpty(href))
      .flatMap((endpoint: string) => this.getFindAllHref(endpoint, options));

    hrefObs
      .filter((href: string) => hasValue(href))
      .take(1)
      .subscribe((href: string) => {
        const request = new FindAllRequest(this.requestService.generateRequestId(), href, options);
        this.requestService.configure(request);
      });

    return this.rdbService.buildList<NormalizedCommunity, Community>(hrefObs) as Observable<RemoteData<PaginatedList<Community>>>;
  }
}
