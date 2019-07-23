import { filter, map, pairwise } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects'
import * as fromRouter from '@ngrx/router-store';
import { RouterNavigationAction } from '@ngrx/router-store';
import { ResetRouteStateAction } from './route.actions';
import { Router } from '@angular/router';

@Injectable()
export class RouteEffects {
  /**
   * Effect that resets the route state on reroute
   * @type {Observable<ResetRouteStateAction>}
   */
  @Effect() routeChange$ = this.actions$
    .pipe(
      ofType(fromRouter.ROUTER_NAVIGATION),
      pairwise(),
      map((actions: RouterNavigationAction[]) =>
        actions.map((navigateAction) => {
          const urlTree = this.router.parseUrl(navigateAction.payload.routerState.url);
          return urlTree.root.children['primary'].segments.map(it => it.path).join('/');
        })),
      filter((actions: string[]) => actions[0] !== actions[1]),
      map(() => new ResetRouteStateAction())
    );

  constructor(private actions$: Actions, private router: Router) {

  }

}
