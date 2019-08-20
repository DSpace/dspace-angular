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
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NormalizedObjectBuildService } from '../cache/builders/normalized-object-build.service';
import { DSOChangeAnalyzer } from './dso-change-analyzer.service';
import { Observable } from 'rxjs/internal/Observable';
import { ContentSourceRequest, FindAllOptions, RestRequest, UpdateContentSourceRequest } from './request.models';
import { RemoteData } from './remote-data';
import { PaginatedList } from './paginated-list';
import { ContentSource } from '../shared/content-source.model';
import {
  configureRequest,
  filterSuccessfulResponses,
  getRequestFromRequestHref,
  getResponseFromEntry
} from '../shared/operators';
import { ContentSourceSuccessResponse, RestResponse } from '../cache/response.models';
import { HttpOptions } from '../dspace-rest-v2/dspace-rest-v2.service';
import { DSpaceRESTv2Serializer } from '../dspace-rest-v2/dspace-rest-v2.serializer';
import { hasValue, isNotEmpty, isNotEmptyOperator } from '../../shared/empty.util';
import { NotificationOptions } from '../../shared/notifications/models/notification-options.model';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class CollectionDataService extends ComColDataService<Collection> {
  protected linkPath = 'collections';
  protected forceBypassCache = false;
  protected errorTitle = 'collection.source.update.notifications.error.title';
  protected contentSourceError = 'collection.source.update.notifications.error.content';

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
    protected comparator: DSOChangeAnalyzer<Collection>,
    protected translate: TranslateService
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

  /**
   * Get the endpoint for the collection's content harvester
   * @param collectionId
   */
  getHarvesterEndpoint(collectionId: string): Observable<string> {
    return this.halService.getEndpoint(this.linkPath).pipe(
      map((href: string) => `${href}/${collectionId}/harvester`)
    );
  }

  /**
   * Get the collection's content harvester
   * @param collectionId
   */
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

  /**
   * Update the settings of the collection's content harvester
   * @param collectionId
   * @param contentSource
   */
  updateContentSource(collectionId: string, contentSource: ContentSource): Observable<ContentSource> {
    const requestId = this.requestService.generateRequestId();
    const serializedContentSource = new DSpaceRESTv2Serializer(ContentSource).serialize(contentSource);
    const request$ = this.getHarvesterEndpoint(collectionId).pipe(
      take(1),
      map((href: string) => {
        const options: HttpOptions = Object.create({});
        let headers = new HttpHeaders();
        headers = headers.append('Content-Type', 'application/json');
        options.headers = headers;
        return new UpdateContentSourceRequest(requestId, href, JSON.stringify(serializedContentSource), options);
      })
    );

    // Execute the post/put request
    request$.pipe(
      configureRequest(this.requestService)
    ).subscribe();

    // Return updated ContentSource
    return this.requestService.getByUUID(requestId).pipe(
      getResponseFromEntry(),
      map((response: RestResponse) => {
        if (!response.isSuccessful) {
          if (hasValue((response as any).errorMessage)) {
            if (response.statusCode === 422) {
              this.notificationsService.error(this.translate.instant(this.errorTitle), this.translate.instant(this.contentSourceError), new NotificationOptions(-1));
            } else {
              this.notificationsService.error(this.translate.instant(this.errorTitle), (response as any).errorMessage, new NotificationOptions(-1));
            }
          }
        } else {
          return response;
        }
      }),
      isNotEmptyOperator(),
      map((response: ContentSourceSuccessResponse) => {
        if (isNotEmpty(response.contentsource)) {
          return response.contentsource;
        }
      })
    );
  }
}
