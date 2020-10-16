import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { UIURLCombiner } from '../url-combiner/ui-url-combiner';

@Injectable()
/**
 * Http Interceptor intercepting Http Requests, adding the URL of our DSpace UI
 * into a custom X-DSpace-UI header.
 *
 * This header provides our REST API with the URL of the User Interface making
 * the request, for the purposes of validating whether the Auth (JWT) Token can
 * be used by this User Interface. (By default Auth Tokens only work from the
 * client/UI which created the token.)
 *
 * In most scenarios, the 'Origin' or 'Referer' headers are used for Token
 * validation (as those are written automatically by web browsers). However,
 * this interceptor is necessary for Angular Universal (Server Side Rendering).
 * SSR requests do not always include "Origin" or "Referer" headers, and
 * therefore the X-DSpace-UI header may be used as a fallback.
 */
export class DSpaceHeaderInterceptor implements HttpInterceptor {

  /**
   * Intercept http requests and add X-DSpace-UI header.
   * @param httpRequest
   * @param next
   */
  intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get root URL of UI (from environment configuration)
    const uiUrl = new UIURLCombiner('/').toString().toLowerCase();

    // Send our UI's URL in X-DSpace-UI custom header in every request
    return next.handle(httpRequest.clone({ setHeaders: { 'X-DSpace-UI': uiUrl } }));
  }
}
