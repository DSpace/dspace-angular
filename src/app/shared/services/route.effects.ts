import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects'
import * as fromRouter from '@ngrx/router-store';
import { ResetRouteStateAction } from './route.actions';

@Injectable()
export class RouteEffects {
  /**
   * Effect that resets the route state on reroute
   * @type {Observable<ResetRouteStateAction>}
   */
  @Effect() routeChange$ = this.actions$
    .pipe(
      ofType(fromRouter.ROUTER_NAVIGATION),
      map(() => new ResetRouteStateAction())
    );

  constructor(private actions$: Actions) {

  }

}
