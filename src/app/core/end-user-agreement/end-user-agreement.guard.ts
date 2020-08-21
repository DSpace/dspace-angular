import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { returnEndUserAgreementUrlTreeOnFalse } from '../shared/operators';
import { EndUserAgreementService } from './end-user-agreement.service';
import { tap } from 'rxjs/operators';

/**
 * A guard redirecting users to the end agreement page when they haven't accepted the latest user agreement
 */
@Injectable()
export class EndUserAgreementGuard implements CanActivate {

  constructor(protected endUserAgreementService: EndUserAgreementService,
              protected router: Router) {
  }

  /**
   * True when the user has accepted the agreements
   * The user will be redirected to the End User Agreement page if they haven't accepted it before
   * A redirect URL will be provided with the navigation so the component can redirect the user back to the blocked route
   * when they're finished accepting the agreement
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    return this.endUserAgreementService.hasCurrentUserAcceptedAgreement().pipe(
      returnEndUserAgreementUrlTreeOnFalse(this.router),
      tap((result) => {
        if (result instanceof UrlTree) {
          this.router.navigateByUrl(result, { state: { redirect: state.url } })
        }
      })
    );
  }
}
