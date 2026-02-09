import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ServerStatusService } from './server-status.service';


@Injectable({
  providedIn: 'root'
})
/**
 * A guard that checks the server state from the store
 * If the server state in the store is not available, redirect to 500 error page
 */
export class ServerStatusGuard implements CanActivateChild {
  constructor(protected serverStatusService: ServerStatusService,) {
  }

  /**
   * True when the server status in the store is available.
   */
  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    return this.serverStatusService.checkServerAvailabilityFromStore()
      .pipe(
        tap((isAvailableInStore: boolean) => {
          if (!isAvailableInStore) {
            this.serverStatusService.navigateToInternalServerErrorPage();
          }
        })
      );
  }
}
