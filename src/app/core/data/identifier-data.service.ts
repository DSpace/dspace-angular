import {
  HttpClient,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  map,
  switchMap,
} from 'rxjs/operators';

import { NotificationsService } from '../../shared/notifications/notifications.service';
import { IdentifierData } from '../../shared/object-list/identifier-data/identifier-data.model';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { CoreState } from '../core-state.model';
import { HttpOptions } from '../dspace-rest/dspace-rest.service';
import { ConfigurationProperty } from '../shared/configuration-property.model';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { Item } from '../shared/item.model';
import { getFirstCompletedRemoteData } from '../shared/operators';
import { sendRequest } from '../shared/request.operators';
import { BaseDataService } from './base/base-data.service';
import { ConfigurationDataService } from './configuration-data.service';
import { DefaultChangeAnalyzer } from './default-change-analyzer.service';
import { RemoteData } from './remote-data';
import { PostRequest } from './request.models';
import { RequestService } from './request.service';
import { RestRequest } from './rest-request.model';

/**
 * The service handling all REST requests to get item identifiers like handles and DOIs
 * from the /identifiers endpoint, as well as the backend configuration that controls whether a 'Register DOI'
 * button appears for admins in the item status page
 */
@Injectable({ providedIn: 'root' })
export class IdentifierDataService extends BaseDataService<IdentifierData> {

  constructor(
    protected comparator: DefaultChangeAnalyzer<IdentifierData>,
    protected halService: HALEndpointService,
    protected http: HttpClient,
    protected notificationsService: NotificationsService,
    protected objectCache: ObjectCacheService,
    protected rdbService: RemoteDataBuildService,
    protected requestService: RequestService,
    protected store: Store<CoreState>,
    private configurationService: ConfigurationDataService,
  ) {
    super('identifiers', requestService, rdbService, objectCache, halService);
  }

  /**
   * Returns {@link RemoteData} of {@link IdentifierData} representing identifiers for this item
   * @param item  Item we are querying
   */
  getIdentifierDataFor(item: Item): Observable<RemoteData<IdentifierData>> {
    return this.findByHref(item._links.identifiers.href, false, true);
  }

  /**
   * Should we allow registration of new DOIs via the item status page?
   */
  public getIdentifierRegistrationConfiguration(): Observable<string[]> {
    return this.configurationService.findByPropertyName('identifiers.item-status.register-doi').pipe(
      getFirstCompletedRemoteData(),
      map((propertyRD: RemoteData<ConfigurationProperty>) => propertyRD.hasSucceeded ? propertyRD.payload.values : []),
    );
  }

  public registerIdentifier(item: Item, type: string): Observable<RemoteData<any>> {
    const requestId = this.requestService.generateRequestId();
    return this.getEndpoint().pipe(
      map((endpointURL: string) => {
        const options: HttpOptions = Object.create({});
        let headers = new HttpHeaders();
        headers = headers.append('Content-Type', 'text/uri-list');
        options.headers = headers;
        let params = new HttpParams();
        params = params.append('type', type);
        options.params = params;
        return new PostRequest(requestId, endpointURL, item._links.self.href, options);
      }),
      sendRequest(this.requestService),
      switchMap((request: RestRequest) => this.rdbService.buildFromRequestUUID(request.uuid) as Observable<RemoteData<any>>),
    );
  }
}
