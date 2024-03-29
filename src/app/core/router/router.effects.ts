import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  Actions,
  createEffect,
  ofType,
} from '@ngrx/effects';
import {
  ROUTER_NAVIGATION,
  RouterNavigationAction,
} from '@ngrx/router-store';
import {
  filter,
  map,
  pairwise,
} from 'rxjs/operators';

import { RouteUpdateAction } from './router.actions';

@Injectable()
export class RouterEffects {
  /**
   * Effect that fires a new RouteUpdateAction when then path of route is changed
   * @type {Observable<RouteUpdateAction>}
   */
  routeChange$ = createEffect(() => this.actions$
    .pipe(
      ofType(ROUTER_NAVIGATION),
      pairwise(),
      map((actions: RouterNavigationAction[]) =>
        actions.map((navigateAction) => {
          const urlTree = this.router.parseUrl(navigateAction.payload.routerState.url);
          return urlTree.root.children.primary.segments.map((it) => it.path).join('/');
        })),
      filter((actions: string[]) => actions[0] !== actions[1]),
      map(() => new RouteUpdateAction()),
    ));

  constructor(private actions$: Actions, private router: Router) {
  }

}
