import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects'
import * as fromRouter from '@ngrx/router-store';

import { SearchSidebarCollapseAction } from './search-sidebar.actions';
import { URLBaser } from '../../core/url-baser/url-baser';

@Injectable()
export class SearchSidebarEffects {
  private previousPath: string;
  @Effect() routeChange$ = this.actions$
    .ofType(fromRouter.ROUTER_NAVIGATION)
    .filter((action) => this.previousPath !== this.getBaseUrl(action))
    .do((action) => {this.previousPath = this.getBaseUrl(action)})
    .map(() => new SearchSidebarCollapseAction());

  constructor(private actions$: Actions) {

  }

  getBaseUrl(action: any): string {
    /* tslint:disable:no-string-literal */
    const url: string = action['payload'].routerState.url;
    return new URLBaser(url).toString();
    /* tslint:enable:no-string-literal */
  }

}
