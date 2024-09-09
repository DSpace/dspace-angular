import { Injectable } from '@angular/core';
import { FeatureID } from '../feature-id';
import { AuthorizationDataService } from '../authorization-data.service';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of as observableOf } from 'rxjs';
import { AuthService } from '../../../auth/auth.service';
import { SomeFeatureAuthorizationGuard } from './some-feature-authorization.guard';

/**
 * Prevent unauthorized activating and loading of routes when the current authenticated user doesn't have administrator
 * rights to the {@link Site}, Community or Collection
 */
@Injectable({
  providedIn: 'root'
})
export class GenericAdministratorGuard extends SomeFeatureAuthorizationGuard {
  constructor(protected authorizationService: AuthorizationDataService, protected router: Router, protected authService: AuthService) {
    super(authorizationService, router, authService);
  }

  /**
   * Check if user have administrator rights to Site, Community or Collection
   */
  getFeatureIDs(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<FeatureID[]> {
    return  observableOf([
      FeatureID.AdministratorOf,
      FeatureID.IsCommunityAdmin,
      FeatureID.IsCollectionAdmin,
    ]);
  }
}
