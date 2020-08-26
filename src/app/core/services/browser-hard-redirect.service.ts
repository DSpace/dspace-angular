import {Inject, Injectable} from '@angular/core';
import {LocationToken} from '../../../modules/app/browser-app.module';

/**
 * Service for performing hard redirects within the browser app module
 */
@Injectable()
export class BrowserHardRedirectService {

  constructor(
    @Inject(LocationToken) protected location: Location,
  ) {
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
  getOriginFromUrl() {
    return this.location.origin;
  }
}
