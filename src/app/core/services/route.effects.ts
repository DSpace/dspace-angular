import { map, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { ResetRouteStateAction, RouteActionTypes } from './route.actions';
import { RouterActionTypes } from '../router/router.actions';
import { RouteService } from './route.service';

@Injectable()
export class RouteEffects {
  /**
   * Effect that resets the route state on reroute
   * @type {Observable<ResetRouteStateAction>}
   */
  @Effect() routeChange$ = this.actions$
    .pipe(
      ofType(RouterActionTypes.ROUTE_UPDATE),
      map(() => new ResetRouteStateAction()),
    );

  @Effect({dispatch: false }) afterResetChange$ = this.actions$
    .pipe(
      ofType(RouteActionTypes.RESET),
      tap(() => this.service.setCurrentRouteInfo()),
    );

  constructor(private actions$: Actions, private service: RouteService) {
  }
}
