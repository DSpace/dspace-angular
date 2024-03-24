import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  Observable,
  of as observableOf,
} from 'rxjs';

import { AbstractEndUserAgreementGuard } from './abstract-end-user-agreement.guard';
import { EndUserAgreementService } from './end-user-agreement.service';

/**
 * A guard redirecting users to the end agreement page when the user agreement cookie hasn't been accepted
 */
@Injectable({ providedIn: 'root' })
export class EndUserAgreementCookieGuard extends AbstractEndUserAgreementGuard {

  constructor(protected endUserAgreementService: EndUserAgreementService,
              protected router: Router) {
    super(router);
  }

  /**
   * True when the user agreement cookie has been accepted
   */
  hasAccepted(): Observable<boolean> {
    return observableOf(this.endUserAgreementService.isCookieAccepted());
  }

}
