import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { XSRFService } from './xsrf.service';

/**
 * Server (SSR) Service to obtain a new CSRF/XSRF token. Because SSR only triggers GET
 * requests a CSRF token is never needed.
 */
@Injectable()
export class ServerXSRFService extends XSRFService {
  initXSRFToken(httpClient: HttpClient): () => Promise<any> {
    return () => new Promise<void>((resolve) => {
      // return immediately, and keep tokenInitialized$ false. The server side can make only GET
      // requests, since it can never get a valid XSRF cookie
      resolve();
    });
  }
}
