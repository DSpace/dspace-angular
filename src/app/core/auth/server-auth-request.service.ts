import { Injectable } from '@angular/core';
import { AuthRequestService } from './auth-request.service';
import { GetRequest } from '../data/request.models';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { RequestService } from '../data/request.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';

/**
 * Server side version of the service to send authentication requests
 */
@Injectable()
export class ServerAuthRequestService extends AuthRequestService {

  constructor(
    halService: HALEndpointService,
    requestService: RequestService,
    rdbService: RemoteDataBuildService
  ) {
    super(halService, requestService, rdbService);
  }

  /**
   * Factory function to create the request object to send. This needs to be a POST client side and
   * a GET server side. Due to CSRF validation, the server isn't allowed to send a POST, so we allow
   * only the server IP to send a GET to this endpoint.
   *
   * @param href The href to send the request to
   * @protected
   */
  protected createShortLivedTokenRequest(href: string): GetRequest {
    return Object.assign(new GetRequest(this.requestService.generateRequestId(), href), {
      responseMsToLive: 2 * 1000 // A short lived token is only valid for 2 seconds.
    });
  }

}
