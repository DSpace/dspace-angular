import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  map,
  switchMap,
} from 'rxjs/operators';

import { RemoteDataBuildService } from '../cache';
import { ObjectCacheService } from '../cache';
import { IdentifiableDataService } from '../data';
import { RemoteData } from '../data';
import { PostRequest } from '../data';
import { RequestService } from '../data';
import { RestRequest } from '../data';
import { HttpOptions } from '../dspace-rest';
import { HALEndpointService } from '../shared';
import { sendRequest } from '../shared';
import { OrcidHistory } from './model';
import { OrcidQueue } from './model';

/**
 * A service that provides methods to make REST requests with Orcid History endpoint.
 */
@Injectable({ providedIn: 'root' })
export class OrcidHistoryDataService extends IdentifiableDataService<OrcidHistory> {

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
  ) {
    super('orcidhistories', requestService, rdbService, objectCache, halService, 10 * 1000);
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
      switchMap((request: RestRequest) => this.rdbService.buildFromRequestUUID(request.uuid)  as Observable<RemoteData<OrcidHistory>>),
    );
  }
}
