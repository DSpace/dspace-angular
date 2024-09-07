import {
  Inject,
  Injectable,
} from '@angular/core';
import {
  Observable,
  of as observableOf,
} from 'rxjs';

import { REQUEST } from '../../../express.tokens';
import { ReferrerService } from './referrer.service';

/**
 * A service to determine the referrer
 *
 * The server implementation will get the referrer from the 'Referer' header of the request sent to
 * the express server
 */
@Injectable()
export class ServerReferrerService extends ReferrerService {

  constructor(
    @Inject(REQUEST) protected request: any,
  ) {
    super();
  }

  /**
   * Return the referrer
   *
   * Return the 'Referer' header from the request, or an empty string if the header wasn't set
   * (for consistency with the document.referrer property on the browser side)
   */
  public getReferrer(): Observable<string> {
    const referrer = this.request.headers.referer || '';
    return observableOf(referrer);
  }
}
