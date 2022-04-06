import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { Observable } from 'rxjs';
import { AppConfig, APP_CONFIG } from 'src/config/app-config.interface';
import { buildRootUrl } from 'src/config/config.util';

@Injectable({ providedIn: 'root' })
/**
 * SSR REST Interceptor intercepting Http Requests, switching base URL for server-to-server request
 */
export class SsrRestUrlInterceptor implements HttpInterceptor {

  private from: string;
  private to: string;

  constructor(
    @Inject(APP_CONFIG) protected appConfig: AppConfig,
    @Inject(REQUEST) protected req: any
  ) {
    this.from = buildRootUrl(this.appConfig.rest);
    this.to = buildRootUrl(this.appConfig.ssr.rest);
  }

  /**
   * Intercept http requests and switch base URL with SSR REST URL
   *
   * @param httpRequest
   * @param next
   */
  intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log(`SSR request ${httpRequest.url}`);
    if (this.from !== this.to && httpRequest.url.startsWith(this.from)) {
      console.log(`SSR replace ${this.from} with ${this.to}`);
      const url = httpRequest.url.replace(this.from, this.to);
      console.log(`SSR request after ${url}`);
      return next.handle(httpRequest.clone({ url }));
    }
    return next.handle(httpRequest);
  }

}
