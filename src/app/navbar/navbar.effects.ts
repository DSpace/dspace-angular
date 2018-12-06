import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects'
import * as fromRouter from '@ngrx/router-store';

import { HostWindowActionTypes } from '../shared/host-window.actions';
import { CollapseMenuAction } from '../shared/menu/menu.actions';
import { MenuID } from '../shared/menu/initial-menus-state';

@Injectable()
export class NavbarEffects {
  menuID = MenuID.PUBLIC;
  @Effect() resize$ = this.actions$
    .pipe(
      ofType(HostWindowActionTypes.RESIZE),
      map(() => new CollapseMenuAction(this.menuID))
    );

  @Effect() routeChange$ = this.actions$
    .pipe(
      ofType(fromRouter.ROUTER_NAVIGATION),
      map(() => new CollapseMenuAction(this.menuID))
    );

  constructor(private actions$: Actions) {

  }

}
