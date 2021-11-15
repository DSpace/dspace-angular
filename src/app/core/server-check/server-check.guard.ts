import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { RootDataService } from '../data/root-data.service';
import { RemoteData } from '../data/remote-data';
import { getPageInternalServerErrorRoute } from '../../app-routing-paths';
import { getFirstCompletedRemoteData } from '../shared/operators';

@Injectable({
  providedIn: 'root'
})
export class ServerCheckGuard implements CanActivate {
  constructor(private router: Router, private rootDataService: RootDataService) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {

    return this.rootDataService.findRoot().pipe(
      getFirstCompletedRemoteData(),
      map((res: RemoteData<any>) => res.hasSucceeded),
      tap((hasSucceeded: boolean) => {
        if (!hasSucceeded) {
          this.router.navigateByUrl(getPageInternalServerErrorRoute());
        }
      }),
    );

  }
}
