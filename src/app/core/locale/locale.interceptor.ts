import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  mergeMap,
  scan,
  take,
} from 'rxjs/operators';

import { HALEndpointService } from '../shared/hal-endpoint.service';
import { LocaleService } from './locale.service';

@Injectable()
export class LocaleInterceptor implements HttpInterceptor {

  constructor(
    protected halEndpointService: HALEndpointService,
    protected localeService: LocaleService,
  ) {
  }

  /**
   * Intercept method
   * @param req
   * @param next
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let newReq: HttpRequest<any>;
    return this.localeService.getLanguageCodeList(req.url === this.halEndpointService.getRootHref())
      .pipe(
        take(1),
        scan((acc: any, value: any) => [...acc, value], []),
        mergeMap((languages) => {
          // Clone the request to add the new header.
          newReq = req.clone({
            headers: req.headers
              .set('Accept-Language', languages.toString()),
          });
          // Pass on the new request instead of the original request.
          return next.handle(newReq);
        }));
  }
}
