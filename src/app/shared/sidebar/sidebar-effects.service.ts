import { map, tap, filter } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import * as fromRouter from '@ngrx/router-store';

import { SidebarCollapseAction } from './sidebar.actions';
import { URLBaser } from '../../core/url-baser/url-baser';

/**
 * Makes sure that if the user navigates to another route, the sidebar is collapsed
 */
@Injectable()
export class SidebarEffects {
  private previousPath: string;
  private previousPathAvailability: string;
  routeChange$ = createEffect(() => this.actions$
  .pipe(
    ofType(fromRouter.ROUTER_NAVIGATION),
    filter((action) => this.previousPath !== this.getBaseUrl(action)),
    tap((action) => {
      this.previousPathAvailability = this.previousPath;
      this.previousPath = this.getBaseUrl(action);
    }),
    filter(() => this.previousPathAvailability !== undefined),
    map(() => new SidebarCollapseAction())
  ));

  constructor(private actions$: Actions) {

  }

  getBaseUrl(action: any): string {
    /* eslint-disable-next-line @typescript-eslint/dot-notation */
    const url: string = action['payload'].routerState.url;
    return new URLBaser(url).toString();
  }

}
