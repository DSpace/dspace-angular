import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { AuthorizationDataService } from '../authorization-data.service';
import { FeatureID } from '../feature-id';
import { Observable } from 'rxjs/internal/Observable';
import { returnUnauthorizedUrlTreeOnFalse } from '../../../shared/operators';
import { combineLatest as observableCombineLatest, of as observableOf } from 'rxjs';
import { switchMap } from 'rxjs/operators';

/**
 * Abstract Guard for preventing unauthorized activating and loading of routes when a user
 * doesn't have authorized rights on a specific feature and/or object.
 * Override the desired getters in the parent class for checking specific authorization on a feature and/or object.
 */
export abstract class FeatureAuthorizationGuard implements CanActivate {
  constructor(protected authorizationService: AuthorizationDataService,
              protected router: Router) {
  }

  /**
   * True when user has authorization rights for the feature and object provided
   * Redirect the user to the unauthorized page when he/she's not authorized for the given feature
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    return observableCombineLatest(this.getFeatureID(route, state), this.getObjectUrl(route, state), this.getEPersonUuid(route, state)).pipe(
      switchMap(([featureID, objectUrl, ePersonUuid]) => this.authorizationService.isAuthorized(featureID, objectUrl, ePersonUuid)),
      returnUnauthorizedUrlTreeOnFalse(this.router)
    );
  }

  /**
   * The type of feature to check authorization for
   * Override this method to define a feature
   */
  abstract getFeatureID(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<FeatureID>;

  /**
   * The URL of the object to check if the user has authorized rights for
   * Override this method to define an object URL. If not provided, the {@link Site}'s URL will be used
   */
  getObjectUrl(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<string> {
    return observableOf(undefined);
  }

  /**
   * The UUID of the user to check authorization rights for
   * Override this method to define an {@link EPerson} UUID. If not provided, the authenticated user's UUID will be used.
   */
  getEPersonUuid(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<string> {
    return observableOf(undefined);
  }
}
