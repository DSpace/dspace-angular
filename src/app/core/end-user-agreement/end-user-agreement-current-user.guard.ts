import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  Observable,
  of as observableOf,
} from 'rxjs';

import { environment } from '../../../environments/environment';
import { AbstractEndUserAgreementGuard } from './abstract-end-user-agreement.guard';
import { EndUserAgreementService } from './end-user-agreement.service';

/**
 * A guard redirecting logged in users to the end agreement page when they haven't accepted the latest user agreement
 */
@Injectable({ providedIn: 'root' })
export class EndUserAgreementCurrentUserGuard extends AbstractEndUserAgreementGuard {

  constructor(protected endUserAgreementService: EndUserAgreementService,
              protected router: Router) {
    super(router);
  }

  /**
   * True when the currently logged in user has accepted the agreements or when the user is not currently authenticated
   */
  hasAccepted(): Observable<boolean> {
    if (!environment.info.enableEndUserAgreement) {
      return observableOf(true);
    }

    return this.endUserAgreementService.hasCurrentUserAcceptedAgreement(true);
  }

}
