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
   * Get the origin of a request
   */
  abstract getOriginFromUrl();
}
