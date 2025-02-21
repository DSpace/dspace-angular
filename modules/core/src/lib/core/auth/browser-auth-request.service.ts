import { Injectable } from '@angular/core';
import {
  Observable,
  of as observableOf,
} from 'rxjs';

import { RemoteDataBuildService } from '../cache';
import { PostRequest } from '../data';
import { RequestService } from '../data';
import { HALEndpointService } from '../shared';
import { AuthRequestService } from './auth-request.service';

/**
 * Client side version of the service to send authentication requests
 */
@Injectable()
export class BrowserAuthRequestService extends AuthRequestService {

  constructor(
    halService: HALEndpointService,
    requestService: RequestService,
    rdbService: RemoteDataBuildService,
  ) {
    super(halService, requestService, rdbService);
  }

  /**
   * Factory function to create the request object to send.
   *
   * @param href The href to send the request to
   * @protected
   */
  protected createShortLivedTokenRequest(href: string): Observable<PostRequest> {
    return observableOf(new PostRequest(this.requestService.generateRequestId(), href));
  }

}
