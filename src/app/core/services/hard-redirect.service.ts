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
   * @param shouldSetCorsHeader
   *    optional to prevent CORS error on redirect
   */
  abstract redirect(url: string, statusCode?: number, shouldSetCorsHeader?: boolean);

  /**
   * Get the current route, with query params included
   * e.g. /search?page=1&query=open%20access&f.dateIssued.min=1980&f.dateIssued.max=2020
   */
  abstract getCurrentRoute(): string;

  /**
   * Get the base public URL of our application.
   * This is used as the base URL for redirects, and should be in the format of
   * i.e. <scheme> "://" <hostname> [ ":" <port> ]
   */
  abstract getBaseUrl(): string;
}
