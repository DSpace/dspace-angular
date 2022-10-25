/* eslint-disable max-classes-per-file */

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { dataService } from '../cache/builders/build-decorators';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { CoreState } from '../core-state.model';
import { DataService } from '../data/data.service';
import { DefaultChangeAnalyzer } from '../data/default-change-analyzer.service';
import { ItemDataService } from '../data/item-data.service';
import { RemoteData } from '../data/remote-data';
import { PostRequest } from '../data/request.models';
import { RestRequest } from '../data/rest-request.model';
import { RequestService } from '../data/request.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { sendRequest } from '../shared/request.operators';
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
    return this.getEndpoint().pipe(
      map((endpointURL: string) => {
        const options: HttpOptions = Object.create({});
        let headers = new HttpHeaders();
        headers = headers.append('Content-Type', 'text/uri-list');
        options.headers = headers;
        return new PostRequest(requestId, endpointURL, orcidQueue._links.self.href, options);
      }),
      sendRequest(this.requestService),
      switchMap((request: RestRequest) => this.rdbService.buildFromRequestUUID(request.uuid)  as Observable<RemoteData<OrcidHistory>>)
    );
  }

  getEndpoint(): Observable<string> {
    return this.halService.getEndpoint(this.dataService.linkPath);
  }

}
