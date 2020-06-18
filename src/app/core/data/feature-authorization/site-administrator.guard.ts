import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthorizationDataService } from './authorization-data.service';
import { FeatureType } from './feature-type';

/**
 * Prevent unauthorized activating and loading of routes when the current authenticated user doesn't have administrator
 * rights to the {@link Site}
 */
@Injectable({
  providedIn: 'root'
})
export class SiteAdministratorGuard implements CanActivate, CanLoad {
  constructor(private authorizationService: AuthorizationDataService) {
  }

  /**
   * True when user has administrator rights to the {@link Site}
   */
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authorizationService.isAuthenticated(FeatureType.AdministratorOf);
  }

  /**
   * True when user has administrator rights to the {@link Site}
   */
  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> {
    return this.authorizationService.isAuthenticated(FeatureType.AdministratorOf);
  }
}
