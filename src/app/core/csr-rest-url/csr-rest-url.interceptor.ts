import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig, APP_CONFIG } from 'src/config/app-config.interface';
import { buildRootUrl } from 'src/config/config.util';

@Injectable({ providedIn: 'root' })
/**
 * CSR REST Interceptor intercepting Http Requests, switching base URL for client-to-server request
 */
export class CsrRestUrlInterceptor implements HttpInterceptor {

  private from: string;
  private to: string;

  constructor(@Inject(APP_CONFIG) protected appConfig: AppConfig) {
    this.from = buildRootUrl(this.appConfig.ssr.rest);
    this.to = buildRootUrl(this.appConfig.rest);
  }

  /**
   * Intercept http requests and switch base URL with CSR REST URL
   *
   * @param httpRequest
   * @param next
   */
  intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log(`CSR request ${httpRequest.url}`);
    if (this.from !== this.to && httpRequest.url.startsWith(this.from)) {
      console.log(`CSR replace ${this.from} with ${this.to}`);
      const url = httpRequest.url.replace(this.from, this.to);
      console.log(`CSR request after ${url}`);
      return next.handle(httpRequest.clone({ url }));
    }
    return next.handle(httpRequest);
  }

}
