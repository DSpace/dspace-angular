import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HALEndpointService } from '../shared/hal-endpoint.service';

@Injectable({ providedIn: 'root' })
export class ProofOfWorkCaptchaDataService {

  private linkPath = 'captcha';

  constructor(
              private halService: HALEndpointService) {
  }

  public getChallengeHref(): Observable<string> {
    return this.getEndpoint().pipe(
      map((endpoint) => endpoint + '/challenge'),
    );
  }

  protected getEndpoint(): Observable<string> {
    return this.halService.getEndpoint(this.linkPath);
  }
}
