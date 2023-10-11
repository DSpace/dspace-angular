import { filter, map, switchMap, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATION } from '@ngrx/router-store';

import { SidebarCollapseAction } from './sidebar.actions';
import { URLBaser } from '../../core/url-baser/url-baser';
import { HostWindowService } from '../host-window.service';
import { NoOpAction } from '../ngrx/no-op.action';

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
      switchMap(() => this.windowService.isXsOrSm()),
      map((isXsOrSm: boolean) => isXsOrSm ? new SidebarCollapseAction() : new NoOpAction())
    ));

  constructor(private actions$: Actions, private windowService: HostWindowService) {

  }

  getBaseUrl(action: any): string {
    /* eslint-disable-next-line @typescript-eslint/dot-notation */
    const url: string = action['payload'].routerState.url;
    return new URLBaser(url).toString();
  }

}
