import { Injectable } from '@angular/core';
import { Observable, of, of as observableOf, switchMap } from 'rxjs';
import { getFirstCompletedRemoteData } from '../shared/operators';
import { catchError, map, tap } from 'rxjs/operators';
import { RemoteData } from '../data/remote-data';
import { Root } from '../data/root.model';
import { RootDataService } from '../data/root-data.service';
import { AppState } from '../../app.reducer';
import { createSelector, Store } from '@ngrx/store';
import { UpdateServerStatusAction } from '../history/server-status.actions';
import { getPageInternalServerErrorRoute } from '../../app-routing-paths';
import { Router } from '@angular/router';
import { coreSelector } from '../core.selectors';
import { CoreState } from '../core-state.model';
import { RestRequestWithResponseParser } from '../data/rest-request-with-response-parser.model';
import { RequestError } from '../data/request-error.model';

export const getServerStatusState = createSelector(coreSelector, (state: CoreState) => state.serverStatus);

/**
 * Service responsible for checking and storing the server status (whether it is running or not)
 */
@Injectable({
  providedIn: 'root'
})
export class ServerStatusService {

  constructor(
    protected rootDataService: RootDataService,
    protected store: Store<AppState>,
    protected router: Router,
  ) {
  }


  /**
   * Check if the server is running based on the value in the store.
   * When the server is not available according to the store, the root endpoint will be checked to verify
   * if the server is still down or has come up again.
   */
  checkServerAvailabilityFromStore(): Observable<boolean> {
    return this.store.select(getServerStatusState).pipe(
      map((state) => state.isAvailable),
      switchMap((isAvailable: boolean) => {
        if (!isAvailable) {
          this.rootDataService.invalidateRootCache();
          return this.isRootServerAvailable();
        } else {
          return of(isAvailable);
        }
      })
    );
  }


  /**
   * Check if the root endpoint is available
   */
  isRootServerAvailable() {
    return this.rootDataService.findRoot(false).pipe(
      getFirstCompletedRemoteData(),
      catchError((err) => {
        console.error(err);
        return observableOf(false);
      }),
      map((rd: RemoteData<Root>) => rd.statusCode === 200)
    );
  }

  /**
   * When a request with an error is provided, the available of the root endpoint will be checked.
   * If the root server is down, update the server status in the store
   * Returns whether the server is running or not
   * @param request - The request to be checked
   * @param error - The error from the request to be checked
   */
  checkAndUpdateServerStatus(request: RestRequestWithResponseParser, error: RequestError): Observable<boolean> {
    if ((error.statusCode === 500 || error.statusCode === 0) && request.method === 'GET' && this.router.url !== getPageInternalServerErrorRoute()) {
      return this.isRootServerAvailable().pipe(
        tap((isAvailable: boolean) => {
          if (!isAvailable) {
            this.store.dispatch(new UpdateServerStatusAction(false));
          }
        })
      );
    }
    return observableOf(true);
  }

  /**
   * Clear the root server cache to ensure that future requests do not use the cached error responses,
   * then navigate to the internal server error page
   */
  navigateToInternalServerErrorPage() {
    this.rootDataService.invalidateRootCache();
    this.router.navigateByUrl(getPageInternalServerErrorRoute());
  }


}
