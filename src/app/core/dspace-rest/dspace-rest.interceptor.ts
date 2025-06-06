import { isPlatformBrowser } from '@angular/common';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import {
  Inject,
  Injectable,
  PLATFORM_ID,
} from '@angular/core';
import { Observable } from 'rxjs';

import {
  APP_CONFIG,
  AppConfig,
} from '../../../config/app-config.interface';
import { isEmpty } from '../../shared/empty.util';

@Injectable()
/**
 * This Interceptor is used to use the configured base URL for the request made during SSR execution
 */
export class DspaceRestInterceptor implements HttpInterceptor {

  /**
   * Contains the configured application base URL
   * @protected
   */
  protected baseUrl: string;
  protected ssrBaseUrl: string;

  constructor(
    @Inject(APP_CONFIG) protected appConfig: AppConfig,
    @Inject(PLATFORM_ID) private platformId: string,
  ) {
    this.baseUrl = this.appConfig.rest.baseUrl;
    this.ssrBaseUrl = this.appConfig.rest.ssrBaseUrl;
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (isPlatformBrowser(this.platformId) || isEmpty(this.ssrBaseUrl) || this.baseUrl === this.ssrBaseUrl) {
      return next.handle(request);
    }

    // Different SSR Base URL specified so replace it in the current request url
    const url = request.url.replace(this.baseUrl, this.ssrBaseUrl);
    const newRequest: HttpRequest<any> = request.clone({ url });
    return next.handle(newRequest);
  }
}
