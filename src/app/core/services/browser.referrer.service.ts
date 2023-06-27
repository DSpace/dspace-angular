import { DOCUMENT } from '@angular/common';
import {
  Inject,
  Injectable,
} from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { hasNoValue } from '../../shared/empty.util';
import { URLCombiner } from '../url-combiner/url-combiner';
import { HardRedirectService } from './hard-redirect.service';
import { ReferrerService } from './referrer.service';
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
    return this.routeService.getHistory().pipe(
      map((history: string[]) => {
        const currentURL = history[history.length - 1];
        // if the current URL isn't set yet, or the only URL in the history is the current one,
        // return document.referrer (note that that may be empty too, e.g. if you've just opened a
        // new browser tab)
        if (hasNoValue(currentURL) || history.every((url: string) => url === currentURL)) {
          return this.document.referrer;
        } else {
          // reverse the history
          const reversedHistory = [...history].reverse();
          // and find the first URL that differs from the current one
          const prevUrl = reversedHistory.find((url: string) => url !== currentURL);
          return new URLCombiner(this.hardRedirectService.getCurrentOrigin(), prevUrl).toString();
        }
      }),
    );
  }
}
