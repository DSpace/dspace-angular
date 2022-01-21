import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';

import { interval, Observable, race } from 'rxjs';
import { map, mergeMapTo, tap } from 'rxjs/operators';

import { RootDataService } from '../data/root-data.service';
import { RemoteData } from '../data/remote-data';
import { getPageInternalServerErrorRoute } from '../../app-routing-paths';
import { getFirstCompletedRemoteData } from '../shared/operators';

@Injectable({
  providedIn: 'root'
})
/**
 * A guard that checks if root api endpoint is reachable.
 * If not redirect to 500 error page
 */
export class ServerCheckGuard implements CanActivateChild {
  constructor(private router: Router, private rootDataService: RootDataService) {
  }

  /**
   * True when root api endpoint is reachable.
   */
  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {

    const uncachedCheck$ = this.rootDataService.findRoot(false);
    // fallback observable used if the uncached one hangs and doesn't emit value
    const cachedCheck$ = interval(200).pipe(mergeMapTo((this.rootDataService.findRoot())));

    return race([uncachedCheck$, cachedCheck$]).pipe(
      getFirstCompletedRemoteData(),
      map((res: RemoteData<any>) => res.hasSucceeded),
      tap((hasSucceeded: boolean) => {
        if (!hasSucceeded) {
          this.rootDataService.invalidateRootCache();
          this.router.navigateByUrl(getPageInternalServerErrorRoute());
        }
      }),
    );

  }
}
