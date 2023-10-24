import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class LdnServicesGuard implements CanActivate {

    constructor(
        //private notifyInfoService: NotifyInfoService,
        private router: Router
    ) {
    }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return true;
        /*return this.notifyInfoService.isCoarConfigEnabled().pipe(
        map(coarLdnEnabled => {
          if (coarLdnEnabled) {
            return true;
          } else {
            return this.router.parseUrl('/404');
          }
        })
      );*/
    }
}
