import { Injectable } from "@angular/core";
import { Effect, Actions } from '@ngrx/effects'
import { HostWindowActionTypes } from "../shared/host-window.actions";
import { routerActions } from "@ngrx/router-store";
import { HeaderCollapseAction } from "./header.actions";

@Injectable()
export class HeaderEffects {

  constructor(
    private actions$: Actions
  ) { }

  @Effect() resize$ = this.actions$
    .ofType(HostWindowActionTypes.RESIZE)
    .map(() => new HeaderCollapseAction());

  @Effect() routeChange$ = this.actions$
    .ofType(routerActions.UPDATE_LOCATION)
    .map(() => new HeaderCollapseAction());
}
