import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Observable,
  switchMap,
} from 'rxjs';

import { NotificationsService } from '../../shared/notifications/notifications.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { HttpOptions } from '../dspace-rest/dspace-rest.service';
import { Bitstream } from '../shared/bitstream.model';
import { Bundle } from '../shared/bundle.model';
import { GenericConstructor } from '../shared/generic-constructor';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { NoContent } from '../shared/NoContent.model';
import { getAllCompletedRemoteData } from '../shared/operators';
import { BundleDataService } from './bundle-data.service';
import { RemoteData } from './remote-data';
import {
  DeleteRequest,
  PostRequest,
  PutRequest,
} from './request.models';
import { RequestService } from './request.service';

@Injectable({
  providedIn: 'root',
})
export class PrimaryBitstreamService {

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected bundleDataService: BundleDataService,
  ) {
  }

  /**
   * Returns the type of HttpOptions object needed from primary bitstream requests.
   * i.e. with a Content-Type header set to `text/uri-list`
   * @protected
   */
  protected getHttpOptions(): HttpOptions {
    const options: HttpOptions = Object.create({});
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'text/uri-list');
    options.headers = headers;
    return options;
  }

  /**
   * Send a request of the given type to the endpointURL with an optional primaryBitstreamSelfLink
   * as payload, and return the resulting Observable<RemoteData>
   *
   * @param requestType               The type of request: PostRequest, PutRequest, or DeleteRequest
   * @param endpointURL               The endpoint URL
   * @param primaryBitstreamSelfLink
   * @protected
   */
  protected createAndSendRequest(
    requestType: GenericConstructor<PostRequest | PutRequest | DeleteRequest>,
    endpointURL: string,
    primaryBitstreamSelfLink?: string,
  ): Observable<RemoteData<Bundle | NoContent>> {
    const requestId = this.requestService.generateRequestId();
    const request = new requestType(
      requestId,
      endpointURL,
      primaryBitstreamSelfLink,
      this.getHttpOptions(),
    );

    this.requestService.send(request);

    return this.rdbService.buildFromRequestUUID(requestId);
  }

  /**
   * Create a new primaryBitstream
   *
   * @param primaryBitstream  The object to create
   * @param bundle            The bundle to create it on
   */
  create(primaryBitstream: Bitstream, bundle: Bundle): Observable<RemoteData<Bundle>> {
    return this.createAndSendRequest(
      PostRequest,
      bundle._links.primaryBitstream.href,
      primaryBitstream.self,
    ) as Observable<RemoteData<Bundle>>;
  }

  /**
   * Update an existing primaryBitstream
   *
   * @param primaryBitstream  The object to update
   * @param bundle            The bundle to update it on
   */
  put(primaryBitstream: Bitstream, bundle: Bundle): Observable<RemoteData<Bundle>> {
    return this.createAndSendRequest(
      PutRequest,
      bundle._links.primaryBitstream.href,
      primaryBitstream.self,
    ) as Observable<RemoteData<Bundle>>;
  }

  /**
   * Delete an existing primaryBitstream
   *
   * @param bundle The bundle to delete it from
   */
  delete(bundle: Bundle): Observable<RemoteData<Bundle>> {
    return this.createAndSendRequest(
      DeleteRequest,
      bundle._links.primaryBitstream.href,
    ).pipe(
      getAllCompletedRemoteData(),
      switchMap((rd: RemoteData<NoContent>) => {
        return this.bundleDataService.findByHref(bundle.self, rd.hasFailed);
      }),
    );
  }

}
