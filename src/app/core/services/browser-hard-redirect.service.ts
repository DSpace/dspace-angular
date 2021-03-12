import { Inject, Injectable, InjectionToken } from '@angular/core';
import { HardRedirectService } from './hard-redirect.service';

export const LocationToken = new InjectionToken('Location');

export function locationProvider(): Location {
  return window.location;
}

/**
 * Service for performing hard redirects within the browser app module
 */
@Injectable({providedIn: 'root'})
export class BrowserHardRedirectService extends HardRedirectService {

  constructor(
    @Inject(LocationToken) protected location: Location,
  ) {
    super();
  }

  /**
   * Perform a hard redirect to URL
   * @param url
   */
  redirect(url: string) {
    this.location.href = url;
  }

  /**
   * Get the origin of a request
   */
  getCurrentRoute() {
    return this.location.pathname + this.location.search;
  }

  /**
   * Get the hostname of the request
   */
  getRequestOrigin() {
    return this.location.origin;
  }
}
