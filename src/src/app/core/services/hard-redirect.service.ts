import { Injectable } from '@angular/core';

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
   * @param statusCode
   *    optional HTTP status code to use for redirect (default = 302, which is a temporary redirect)
   */
  abstract redirect(url: string, statusCode?: number);

  /**
   * Get the current route, with query params included
   * e.g. /search?page=1&query=open%20access&f.dateIssued.min=1980&f.dateIssued.max=2020
   */
  abstract getCurrentRoute(): string;

  /**
   * Get the origin of the current URL
   * i.e. <scheme> "://" <hostname> [ ":" <port> ]
   * e.g. if the URL is https://demo.dspace.org/search?query=test,
   * the origin would be https://demo.dspace.org
   */
  abstract getCurrentOrigin(): string;
}
