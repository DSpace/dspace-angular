import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { URLCombiner } from '../url-combiner/url-combiner';

/**
 * Service to take care of hard redirects
 */
@Injectable()
export abstract class HardRedirectService {

  /**
   * Perform a hard redirect to a given location.
   *
   * @param url
   *    the page to redirect to
   */
  abstract redirect(url: string);

  /**
   * Get the current route, with query params included
   * e.g. /search?page=1&query=open%20access&f.dateIssued.min=1980&f.dateIssued.max=2020
   */
  abstract getCurrentRoute();

  /**
   * Get the hostname of the request
   */
  abstract getRequestOrigin();

  public rewriteDownloadURL(originalUrl: string): string {
    if (environment.rewriteDownloadUrls) {
      const hostName = this.getRequestOrigin();
      const namespace = environment.rest.nameSpace;
      const rewrittenUrl = new URLCombiner(hostName, namespace).toString();
      return originalUrl.replace(environment.rest.baseUrl, rewrittenUrl);
    } else {
      return originalUrl;
    }
  }
}
