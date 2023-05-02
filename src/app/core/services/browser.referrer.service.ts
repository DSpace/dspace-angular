import { ReferrerService } from './referrer.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { isEmpty } from '../../shared/empty.util';
import { URLCombiner } from '../url-combiner/url-combiner';
import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { HardRedirectService } from './hard-redirect.service';
import { RouteService } from './route.service';

/**
 * A service to determine the referrer
 *
 * The browser implementation will get the referrer from document.referrer, in the event that the
 * previous page visited was not an angular URL. If it was, the route history in the store must be
 * used, since document.referrer doesn't get updated on route changes
 */
@Injectable()
export class BrowserReferrerService extends ReferrerService {

  constructor(
    @Inject(DOCUMENT) protected document: any,
    protected routeService: RouteService,
    protected hardRedirectService: HardRedirectService,
  ) {
    super();
  }

  /**
   * Return the referrer
   *
   * Return the referrer URL based on the route history in the store. If there is no route history
   * in the store yet, document.referrer will be used
   */
  public getReferrer(): Observable<string> {
    return this.routeService.getPreviousUrl().pipe(
      map((prevUrl: string) => {
        // if we don't have anything in the history yet, return document.referrer
        // (note that that may be empty too, e.g. if you've just opened a new browser tab)
        if (isEmpty(prevUrl)) {
          return this.document.referrer;
        } else {
          return new URLCombiner(this.hardRedirectService.getCurrentOrigin(), prevUrl).toString();
        }
      })
    );
  }
}
