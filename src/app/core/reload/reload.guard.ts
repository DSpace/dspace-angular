import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';
import { isNotEmpty } from '../../shared/empty.util';

/**
 * A guard redirecting the user to the URL provided in the route's query params
 * When no redirect url is found, the user is redirected to the homepage
 */
@Injectable()
export class ReloadGuard implements CanActivate {
  constructor(private router: Router) {
  }

  /**
   * Get the UrlTree of the URL to redirect to
   * @param route
   * @param state
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): UrlTree {
    if (isNotEmpty(route.queryParams.redirect)) {
      return this.router.parseUrl(route.queryParams.redirect);
    } else {
      return this.router.createUrlTree(['home']);
    }
  }
}
