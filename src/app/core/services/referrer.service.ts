import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * A service to determine the referrer, i.e. the previous URL that led the user to the current one
 */
@Injectable()
export abstract class ReferrerService {

  /**
   * Return the referrer
   */
  abstract getReferrer(): Observable<string>;

}
