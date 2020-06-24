import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment
} from '@angular/router';
import { AuthorizationDataService } from '../authorization-data.service';
import { FeatureID } from '../feature-id';
import { Observable } from 'rxjs/internal/Observable';
import { redirectToUnauthorizedOnFalse } from '../../../shared/operators';

/**
 * Abstract Guard for preventing unauthorized activating and loading of routes when a user
 * doesn't have authorized rights on a specific feature and/or object.
 * Override the desired getters in the parent class for checking specific authorization on a feature and/or object.
 */
export abstract class FeatureAuthorizationGuard implements CanActivate, CanLoad {
  constructor(protected authorizationService: AuthorizationDataService,
              protected router: Router) {
  }

  /**
   * True when user has authorization rights for the feature and object provided
   * Redirect the user to the unauthorized page when he/she's not authorized for the given feature
   */
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authorizationService.isAuthenticated(this.getFeatureID(), this.getObjectUrl(), this.getEPersonUuid()).pipe(redirectToUnauthorizedOnFalse(this.router));
  }

  /**
   * True when user has authorization rights for the feature and object provided
   * Redirect the user to the unauthorized page when he/she's not authorized for the given feature
   */
  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> {
    return this.authorizationService.isAuthenticated(this.getFeatureID(), this.getObjectUrl(), this.getEPersonUuid()).pipe(redirectToUnauthorizedOnFalse(this.router));
  }

  /**
   * The type of feature to check authorization for
   * Override this method to define a feature
   */
  abstract getFeatureID(): FeatureID;

  /**
   * The URL of the object to check if the user has authorized rights for
   * Override this method to define an object URL. If not provided, the {@link Site}'s URL will be used
   */
  getObjectUrl(): string {
    return undefined;
  }

  /**
   * The UUID of the user to check authorization rights for
   * Override this method to define an {@link EPerson} UUID. If not provided, the authenticated user's UUID will be used.
   */
  getEPersonUuid(): string {
    return undefined;
  }
}
