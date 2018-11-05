import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects'
import * as fromRouter from '@ngrx/router-store';

import { HostWindowActionTypes } from '../shared/host-window.actions';
import { NavbarCollapseAction } from './navbar.actions';

@Injectable()
export class NavbarEffects {

  @Effect() resize$ = this.actions$
    .ofType(HostWindowActionTypes.RESIZE)
    .map(() => new NavbarCollapseAction());

  @Effect() routeChange$ = this.actions$
    .ofType(fromRouter.ROUTER_NAVIGATION)
    .map(() => new NavbarCollapseAction());

  constructor(private actions$: Actions) {

  }

}
