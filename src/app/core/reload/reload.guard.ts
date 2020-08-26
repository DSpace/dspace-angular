import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';
import { isNotEmpty } from '../../shared/empty.util';

@Injectable()
export class ReloadGuard implements CanActivate {
  constructor(private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): UrlTree {
    if (isNotEmpty(route.queryParams.redirect)) {
      return this.router.parseUrl(route.queryParams.redirect);
    } else {
      return this.router.createUrlTree(['home']);
    }
  }
}
