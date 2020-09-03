import { Injectable } from '@angular/core';
import { AbstractEndUserAgreementGuard } from './abstract-end-user-agreement.guard';
import { Observable } from 'rxjs/internal/Observable';
import { of as observableOf } from 'rxjs';
import { EndUserAgreementService } from './end-user-agreement.service';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

/**
 * A guard redirecting users to the end agreement page when the user agreement cookie hasn't been accepted
 */
@Injectable()
export class EndUserAgreementCookieGuard extends AbstractEndUserAgreementGuard {

  constructor(protected endUserAgreementService: EndUserAgreementService,
              protected authService: AuthService,
              protected router: Router) {
    super(authService, router);
  }

  /**
   * True when the user agreement cookie has been accepted
   */
  hasAccepted(): Observable<boolean> {
    return observableOf(this.endUserAgreementService.isCookieAccepted());
  }

}
