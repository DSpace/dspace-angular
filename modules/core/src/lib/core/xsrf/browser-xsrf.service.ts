import { HttpClient } from '@angular/common/http';
import {
  inject,
  Injectable,
} from '@angular/core';
import { take } from 'rxjs/operators';

import { APP_CONFIG } from '../config/app-config.interface';
import { RESTURLCombiner } from '../url-combiner/rest-url-combiner';
import { XSRFService } from './xsrf.service';

/**
 * Browser (CSR) Service to obtain a new CSRF/XSRF token when needed by our RequestService
 * to perform a modify request (e.g. POST/PUT/DELETE).
 * NOTE: This is primarily necessary before the *first* modifying request, as the CSRF
 * token may not yet be initialized.
 */
@Injectable()
export class BrowserXSRFService extends XSRFService {
  private readonly appConfig = inject(APP_CONFIG);

  initXSRFToken(httpClient: HttpClient): () => Promise<any> {
    return () => new Promise<void>((resolve) => {
      // Force a new token to be created by calling the CSRF endpoint
      httpClient.get(new RESTURLCombiner(this.appConfig.rest.baseUrl, '/security/csrf').toString(), undefined).pipe(
        take(1),
      ).subscribe(() => {
        // Once token is returned, set tokenInitialized to true.
        this.tokenInitialized$.next(true);
      });

      // return immediately, the rest of the app doesn't need to wait for this to finish
      resolve();
    });
  }
}
