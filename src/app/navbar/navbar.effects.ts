import { first, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as fromRouter from '@ngrx/router-store';

import { HostWindowActionTypes } from '../shared/host-window.actions';
import {
  CollapseMenuAction,
  ExpandMenuPreviewAction,
  MenuActionTypes
} from '../shared/menu/menu.actions';
import { MenuID } from '../shared/menu/initial-menus-state';
import { MenuService } from '../shared/menu/menu.service';
import { MenuState } from '../shared/menu/menu.reducer';
import { NoOpAction } from '../shared/ngrx/no-op.action';

@Injectable()
export class NavbarEffects {
  menuID = MenuID.PUBLIC;
  /**
   * Effect that collapses the public menu on window resize
   * @type {Observable<CollapseMenuAction>}
   */
  @Effect() resize$ = this.actions$
    .pipe(
      ofType(HostWindowActionTypes.RESIZE),
      map(() => new CollapseMenuAction(this.menuID))
    );

  /**
   * Effect that collapses the public menu on reroute
   * @type {Observable<CollapseMenuAction>}
   */
  @Effect() routeChange$ = this.actions$
    .pipe(
      ofType(fromRouter.ROUTER_NAVIGATION),
      map(() => new CollapseMenuAction(this.menuID))
    );
  /**
   * Effect that collapses the public menu when the admin sidebar opens
   * @type {Observable<CollapseMenuAction>}
   */
  @Effect() openAdminSidebar$ = this.actions$
    .pipe(
      ofType(MenuActionTypes.EXPAND_MENU_PREVIEW),
      switchMap((action: ExpandMenuPreviewAction) => {
        return this.menuService.getMenu(action.menuID).pipe(
          first(),
          map((menu: MenuState) => {
            if (menu.id === MenuID.ADMIN) {
              if (!menu.previewCollapsed && menu.collapsed) {
                return new CollapseMenuAction(MenuID.PUBLIC);
              }
            }
            return new NoOpAction();
          }));
      })
    );
  constructor(private actions$: Actions, private menuService: MenuService) {

  }

}
