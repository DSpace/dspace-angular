import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { NotifyInfoService } from './notify-info.service';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class NotifyInfoGuard implements CanActivate {
    constructor(
        private notifyInfoService: NotifyInfoService,
        private router: Router
    ) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> {
        return this.notifyInfoService.isCoarConfigEnabled().pipe(
            map(coarLdnEnabled => {
                if (coarLdnEnabled) {
                    return true;
                } else {
                    return this.router.parseUrl('/404');
                }
            })
        );
    }
}
