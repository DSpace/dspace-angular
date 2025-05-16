import {
  HttpClient,
  HttpHeaders,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RESTURLCombiner } from 'src/app/core/url-combiner/rest-url-combiner';

import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { PostRequest } from '../data/request.models';
import { RequestService } from '../data/request.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import {
  DSPACE_XSRF_COOKIE,
  XSRF_REQUEST_HEADER,
  XSRF_RESPONSE_HEADER,
} from '../xsrf/xsrf.constants';
import { XSRFService } from '../xsrf/xsrf.service';
import { AuthRequestService } from './auth-request.service';

/**
 * Server side version of the service to send authentication requests
 */
@Injectable({ providedIn: 'root' })
export class ServerAuthRequestService extends AuthRequestService {

  constructor(
    halService: HALEndpointService,
    requestService: RequestService,
    rdbService: RemoteDataBuildService,
    protected httpClient: HttpClient,
    protected xsrfService: XSRFService,
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
    // First do a call to the csrf endpoint in order to get an XSRF token
    return this.httpClient.get(new RESTURLCombiner('/security/csrf').toString(), { observe: 'response' }).pipe(
      // retrieve the XSRF token from the response header
      map((response: HttpResponse<any>) => response.headers.get(XSRF_RESPONSE_HEADER)),
      map((xsrfToken: string) => {
        if (!xsrfToken) {
          throw new Error('Failed to initialize XSRF token');
        }
        this.xsrfService.tokenInitialized$.next(true);
        return xsrfToken;
      }),
      // Use that token to create an HttpHeaders object
      map((xsrfToken: string) => new HttpHeaders()
        .set('Content-Type', 'application/json; charset=utf-8')
      // set the token as the XSRF header
        .set(XSRF_REQUEST_HEADER, xsrfToken)
      // and as the DSPACE-XSRF-COOKIE
        .set('Cookie', `${DSPACE_XSRF_COOKIE}=${xsrfToken}`)),
      map((headers: HttpHeaders) =>
        // Create a new PostRequest using those headers and the given href
        new PostRequest(
          this.requestService.generateRequestId(),
          href,
          {},
          {
            headers: headers,
          },
        ),
      ),
    );
  }

}
