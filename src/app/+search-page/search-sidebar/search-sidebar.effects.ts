import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects'
import * as fromRouter from '@ngrx/router-store';

import { HostWindowActionTypes } from '../../shared/host-window.actions';
import { SearchSidebarCollapseAction } from './search-sidebar.actions';

@Injectable()
export class SearchSidebarEffects {

  @Effect() routeChange$ = this.actions$
    .ofType(fromRouter.ROUTER_NAVIGATION)
    .map(() => new SearchSidebarCollapseAction());

  constructor(private actions$: Actions) {

  }

}
