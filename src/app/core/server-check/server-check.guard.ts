import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ServerCheckService } from './server-check.service';


@Injectable({
  providedIn: 'root'
})
/**
 * A guard that checks if root api endpoint is reachable.
 * If not redirect to 500 error page
 */
export class ServerCheckGuard implements CanActivateChild {
  constructor(protected serverCheckService: ServerCheckService,) {
  }

  /**
   * True when root api endpoint is reachable.
   */
  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    return this.serverCheckService.checkServerAvailabilityFromStore()
      .pipe(
        tap((isReallyAvailable: boolean) => {
          if (!isReallyAvailable) {
            this.serverCheckService.invalidateCacheAndNavigateToInternalServerErrorPage();
          }
        })
      );
  }
}
