import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import {
  Observable,
  of as observableOf,
} from 'rxjs';

import { AuthService } from '../../../auth/auth.service';
import { AuthorizationDataService } from '../authorization-data.service';
import { FeatureID } from '../feature-id';
import { SingleFeatureAuthorizationGuard } from './single-feature-authorization.guard';

/**
 * Prevent unauthorized activating and loading of routes when the current authenticated user
 * isn't a Community administrator
 */
@Injectable({
  providedIn: 'root',
})
export class CommunityAdministratorGuard extends SingleFeatureAuthorizationGuard {
  constructor(protected authorizationService: AuthorizationDataService, protected router: Router, protected authService: AuthService) {
    super(authorizationService, router, authService);
  }

  /**
   * Check group management rights
   */
  getFeatureID(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<FeatureID> {
    return observableOf(FeatureID.IsCommunityAdmin);
  }
}
