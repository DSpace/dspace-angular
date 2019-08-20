import { Injectable } from '@angular/core';

import { filter, map, take, tap } from 'rxjs/operators';
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
import { ContentSourceRequest, FindAllOptions, RestRequest } from './request.models';
import { RemoteData } from './remote-data';
import { PaginatedList } from './paginated-list';
import { ContentSource } from '../shared/content-source.model';
import { configureRequest, filterSuccessfulResponses, getRequestFromRequestHref } from '../shared/operators';
import { ContentSourceSuccessResponse } from '../cache/response.models';

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

  getHarvesterEndpoint(collectionId: string): Observable<string> {
    return this.halService.getEndpoint(this.linkPath).pipe(
      map((href: string) => `${href}/${collectionId}/harvester`)
    );
  }

  getContentSource(collectionId: string): Observable<ContentSource> {
    return this.getHarvesterEndpoint(collectionId).pipe(
      map((href: string) => new ContentSourceRequest(this.requestService.generateRequestId(), href)),
      configureRequest(this.requestService),
      map((request: RestRequest) => request.href),
      getRequestFromRequestHref(this.requestService),
      filterSuccessfulResponses(),
      map((response: ContentSourceSuccessResponse) => response.contentsource)
    );
  }
}
