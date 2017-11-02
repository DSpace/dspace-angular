import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects'
import * as fromRouter from '@ngrx/router-store';

import { HostWindowActionTypes } from '../shared/host-window.actions';
import { HeaderCollapseAction } from './header.actions';
import { UniversalService } from '../universal.service';

@Injectable()
export class HeaderEffects {

  @Effect() resize$ = this.actions$
    .ofType(HostWindowActionTypes.RESIZE)
    .filter(() => !this.universalService.isReplaying)
    .map(() => new HeaderCollapseAction());

  @Effect() routeChange$ = this.actions$
    .ofType(fromRouter.ROUTER_NAVIGATION)
    .filter(() => !this.universalService.isReplaying)
    .map(() => new HeaderCollapseAction());

  constructor(
    private actions$: Actions,
    private universalService: UniversalService
  ) {

  }

}
