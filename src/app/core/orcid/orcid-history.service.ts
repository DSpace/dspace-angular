/* tslint:disable:max-classes-per-file */

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { catchError, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { isNotEmpty } from '../../shared/empty.util';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { createFailedRemoteDataObject$ } from '../../shared/remote-data.utils';
import { dataService } from '../cache/builders/build-decorators';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { RestResponse } from '../cache/response.models';
import { CoreState } from '../core.reducers';
import { DataService } from '../data/data.service';
import { DefaultChangeAnalyzer } from '../data/default-change-analyzer.service';
import { ItemDataService } from '../data/item-data.service';
import { RemoteData } from '../data/remote-data';
import { PostRequest } from '../data/request.models';
import { RequestService } from '../data/request.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { configureRequest, getFinishedRemoteData, getResponseFromEntry } from '../shared/operators';
import { OrcidHistory } from './model/orcid-history.model';
import { ORCID_HISTORY } from './model/orcid-history.resource-type';
import { OrcidQueue } from './model/orcid-queue.model';
import { HttpOptions } from '../dspace-rest/dspace-rest.service';

/**
 * A private DataService implementation to delegate specific methods to.
 */
class OrcidHistoryServiceImpl extends DataService<OrcidHistory> {
  public linkPath = 'orcidhistories';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DefaultChangeAnalyzer<OrcidHistory>) {
    super();
  }

}

/**
 * A service that provides methods to make REST requests with Orcid History endpoint.
 */
@Injectable()
@dataService(ORCID_HISTORY)
export class OrcidHistoryService {

  dataService: OrcidHistoryServiceImpl;

  responseMsToLive: number = 10 * 1000;

  constructor(
      protected requestService: RequestService,
      protected rdbService: RemoteDataBuildService,
      protected store: Store<CoreState>,
      protected objectCache: ObjectCacheService,
      protected halService: HALEndpointService,
      protected notificationsService: NotificationsService,
      protected http: HttpClient,
      protected comparator: DefaultChangeAnalyzer<OrcidHistory>,
      protected itemService: ItemDataService ) {

          this.dataService = new OrcidHistoryServiceImpl(requestService, rdbService, store, objectCache, halService,
              notificationsService, http, comparator);

  }

  sendToORCID(orcidQueue: OrcidQueue): Observable<RemoteData<OrcidHistory>> {
    const requestId = this.requestService.generateRequestId();
    const options: HttpOptions = Object.create({});
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'text/uri-list');
    options.headers = headers;
    this.getEndpoint().pipe(
      map((href: string) => {
        return new PostRequest(requestId, href, orcidQueue._links.self.href, options);
      }),
      configureRequest(this.requestService)
    ).subscribe();

    return this.fetchCreateResponse(requestId).pipe(
      getFinishedRemoteData(),
      catchError((error: Error) => createFailedRemoteDataObject$() as Observable<RemoteData<OrcidHistory>>));
    }

  protected fetchCreateResponse(requestId: string): Observable <RemoteData<OrcidHistory>> {
    // Resolve self link for new object
    const selfLink$ = this.requestService.getByUUID(requestId).pipe(
      getResponseFromEntry(),
      map((response: RestResponse) => {
        if (!response.isSuccessful ) {
          throw new Error((response as any).errorMessage);
        } else {
          return response;
        }
      }),
      map((response: any) => {
        if (isNotEmpty(response.resourceSelfLinks)) {
          return response.resourceSelfLinks[0];
        }
      }),
      distinctUntilChanged()
    ) as Observable<string>;

    return selfLink$.pipe(
      switchMap((selfLink: string) => this.dataService.findByHref(selfLink)),
    );
  }

  getEndpoint() {
    return this.halService.getEndpoint(this.dataService.linkPath);
  }

}
