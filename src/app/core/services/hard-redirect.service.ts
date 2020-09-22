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
   */
  abstract redirect(url: string);

  /**
   * Get the current route, with query params included
   * e.g. /search?page=1&query=open%20access&f.dateIssued.min=1980&f.dateIssued.max=2020
   */
  abstract getCurrentRoute();
}
