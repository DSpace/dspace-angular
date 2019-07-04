import { Injectable } from '@angular/core';

import { filter, map, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { CoreState } from '../core.reducers';
import { Collection } from '../shared/collection.model';
import { ComColDataService } from './comcol-data.service';
import { CommunityDataService } from './community-data.service';
import { RequestService } from './request.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { HttpClient } from '@angular/common/http';
import { NormalizedObjectBuildService } from '../cache/builders/normalized-object-build.service';
import { DSOChangeAnalyzer } from './dso-change-analyzer.service';
import { Observable } from 'rxjs/internal/Observable';
import { FindAllOptions } from './request.models';
import { RemoteData } from './remote-data';
import { PaginatedList } from './paginated-list';
import { SearchParam } from '../cache/models/search-param.model';

@Injectable()
export class CollectionDataService extends ComColDataService<Collection> {
  protected linkPath = 'collections';
  protected forceBypassCache = false;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected dataBuildService: NormalizedObjectBuildService,
    protected store: Store<CoreState>,
    protected cds: CommunityDataService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DSOChangeAnalyzer<Collection>
  ) {
    super();
  }

  /**
   * Get all collections whom user has authorization to submit to by community
   *
   * @return boolean
   *    true if the user has at least one collection to submit to
   */
  getAuthorizedCollectionByCommunity(communityId): Observable<RemoteData<PaginatedList<Collection>>> {
    const searchHref = 'findAuthorizedByCommunity';
    const options = new FindAllOptions();
    options.elementsPerPage = 1000;
    options.searchParams = [new SearchParam('uuid', communityId)];

    return this.searchBy(searchHref, options).pipe(
      filter((collections: RemoteData<PaginatedList<Collection>>) => !collections.isResponsePending));
  }

  /**
   * Find whether there is a collection whom user has authorization to submit to
   *
   * @return boolean
   *    true if the user has at least one collection to submit to
   */
  hasAuthorizedCollection(): Observable<boolean> {
    const searchHref = 'findAuthorized';
    const options = new FindAllOptions();
    options.elementsPerPage = 1;

    return this.searchBy(searchHref, options).pipe(
      filter((collections: RemoteData<PaginatedList<Collection>>) => !collections.isResponsePending),
      take(1),
      map((collections: RemoteData<PaginatedList<Collection>>) => collections.payload.totalElements > 0)
    );
  }
}
