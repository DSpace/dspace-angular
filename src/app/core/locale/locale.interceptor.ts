import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import {
  inject,
  Injectable,
} from '@angular/core';
import {
  APP_CONFIG,
  AppConfig,
} from '@dspace/config/app-config.interface';
import { RESTURLCombiner } from '@dspace/core/url-combiner/rest-url-combiner';
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
  protected readonly appConfig: AppConfig = inject(APP_CONFIG);

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
    let ignoreEPersonSettings = false;
    const ePersonEndpointUrl = new RESTURLCombiner(this.appConfig.rest.baseUrl, 'eperson/epersons').toString();

    if (req.url === this.halEndpointService.getRootHref() || req.url.startsWith(ePersonEndpointUrl)) {
      ignoreEPersonSettings = true;
    }

    return this.localeService.getLanguageCodeList(ignoreEPersonSettings)
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
