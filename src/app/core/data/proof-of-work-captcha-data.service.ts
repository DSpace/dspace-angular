import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HALEndpointService } from '../shared/hal-endpoint.service';

/**
 * Service for retrieving captcha challenge data, so proof-of-work calculations can be performed
 * and returned with protected form data.
 */
@Injectable({ providedIn: 'root' })
export class ProofOfWorkCaptchaDataService {

  private linkPath = 'captcha';

  constructor(
              private halService: HALEndpointService) {
  }

  /**
   * Get the endpoint for retrieving a new captcha challenge, to be passed
   * to the Altcha captcha component as an input property
   */
  public getChallengeHref(): Observable<string> {
    return this.getEndpoint().pipe(
      map((endpoint) => endpoint + '/challenge'),
    );
  }

  /**
   * Get the base CAPTCHA endpoint URL
   * @protected
   */
  protected getEndpoint(): Observable<string> {
    return this.halService.getEndpoint(this.linkPath);
  }
}
