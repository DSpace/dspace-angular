import { Injectable } from '@angular/core';
import { Observable, of, of as observableOf, switchMap } from 'rxjs';
import { getFirstCompletedRemoteData } from '../shared/operators';
import { catchError, map } from 'rxjs/operators';
import { RemoteData } from '../data/remote-data';
import { Root } from '../data/root.model';
import { RootDataService } from '../data/root-data.service';
import { AppState } from '../../app.reducer';
import { createSelector, Store } from '@ngrx/store';
import { UpdateServerHealthAction } from '../history/server-health.actions';
import { getPageInternalServerErrorRoute } from '../../app-routing-paths';
import { Router } from '@angular/router';
import { coreSelector } from '../core.selectors';
import { CoreState } from '../core-state.model';
import { RestRequestWithResponseParser } from '../data/rest-request-with-response-parser.model';
import { RequestError } from '../data/request-error.model';
import { RESTURLCombiner } from '../url-combiner/rest-url-combiner';

export const getServerhealthState = createSelector(coreSelector, (state: CoreState) => state.serverHealth);


@Injectable({
  providedIn: 'root'
})

export class ServerCheckService {

  constructor(
    protected rootDataService: RootDataService,
    protected store: Store<AppState>,
    protected router: Router,
  ) {
  }


  /**
   * Check if root endpoint is available
   */
  checkServerAvailabilityFromStore(): Observable<boolean> {
    return this.store.select(getServerhealthState).pipe(
      map((state) => state.isOnline),
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


  private isRootServerAvailable() {
    return this.rootDataService.findRoot(false).pipe(
      getFirstCompletedRemoteData(),
      catchError((err) => {
        console.error(err);
        return observableOf(false);
      }),
      map((rd: RemoteData<Root>) => rd.statusCode === 200)
    );
  }

  checkAndUpdateServerAvailability(request: RestRequestWithResponseParser, error: RequestError) {
    if ((error.statusCode === 500 || error.statusCode === 0) && request.method === 'GET' && this.router.url != getPageInternalServerErrorRoute() && request.href !== new RESTURLCombiner().toString()) {
      this.isRootServerAvailable().pipe(
      ).subscribe((isAvailable: boolean) => {
        if (!isAvailable) {
          this.store.dispatch(new UpdateServerHealthAction(false));
          this.invalidateCacheAndNavigateToInternalServerErrorPage();
        }
      });
    }
  }

  invalidateCacheAndNavigateToInternalServerErrorPage() {
    this.rootDataService.invalidateRootCache();
    this.router.navigateByUrl(getPageInternalServerErrorRoute());
  }


}
