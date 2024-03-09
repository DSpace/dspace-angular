import { Injectable } from '@angular/core';
import {
  Actions,
  createEffect,
  ofType,
} from '@ngrx/effects';
import { ROUTER_NAVIGATION } from '@ngrx/router-store';
import {
  filter,
  map,
  tap,
} from 'rxjs/operators';

import { URLBaser } from '../../core/url-baser/url-baser';
import { SidebarCollapseAction } from './sidebar.actions';

/**
 * Makes sure that if the user navigates to another route, the sidebar is collapsed
 */
@Injectable()
export class SidebarEffects {
  private previousPath: string;
  routeChange$ = createEffect(() => this.actions$
    .pipe(
      ofType(ROUTER_NAVIGATION),
      filter((action) => this.previousPath !== this.getBaseUrl(action)),
      tap((action) => {
        this.previousPath = this.getBaseUrl(action);
      }),
      map(() => new SidebarCollapseAction()),
    ));

  constructor(private actions$: Actions) {

  }

  getBaseUrl(action: any): string {
    /* eslint-disable-next-line @typescript-eslint/dot-notation */
    const url: string = action['payload'].routerState.url;
    return new URLBaser(url).toString();
  }

}
