import { FeatureAuthorizationGuard } from './feature-authorization.guard';
import { Injectable } from '@angular/core';
import { AuthorizationDataService } from '../authorization-data.service';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { FeatureID } from '../feature-id';
import { of as observableOf } from 'rxjs';

/**
 * Prevent unauthorized activating and loading of routes when the current authenticated user doesn't have registration
 * rights to the {@link Site}
 */
@Injectable({
  providedIn: 'root'
})
export class SiteRegisterGuard extends FeatureAuthorizationGuard {
  constructor(protected authorizationService: AuthorizationDataService, protected router: Router) {
    super(authorizationService, router);
  }

  /**
   * Check registration authorization rights
   */
  getFeatureID(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<FeatureID> {
    return observableOf(FeatureID.EPersonRegistration);
  }
}
