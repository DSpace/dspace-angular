import { Injectable } from "@angular/core";
import { Effect, Actions } from '@ngrx/effects'
import { HeaderActions } from "./header.actions";
import { HostWindowActions } from "../shared/host-window.actions";
import { routerActions } from "@ngrx/router-store";

@Injectable()
export class HeaderEffects {

  constructor(
    private actions$: Actions
  ) { }

  @Effect() resize$ = this.actions$
    .ofType(HostWindowActions.RESIZE)
    .map(() => HeaderActions.collapse());

  @Effect() routeChange$ = this.actions$
    .ofType(routerActions.UPDATE_LOCATION)
    .map(() => HeaderActions.collapse());
}
