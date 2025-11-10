import { Injectable } from '@angular/core';
import {
  Actions,
  createEffect,
  ofType,
} from '@ngrx/effects';
import {
  map,
  tap,
} from 'rxjs/operators';

import { StoreActionTypes } from '../../store.actions';
import {
  CollapseMenuAction,
  ExpandMenuAction,
  MenuActionTypes,
  ReinitMenuAction,
  ToggleMenuAction,
} from './menu.actions';
import { MenuService } from './menu.service';

@Injectable()
export class MenuEffects {

  /**
   * When the store is rehydrated in the browser, re-initialise the menus to ensure
   * the menus with functions are loaded correctly.
   */
  reinitDSOMenus = createEffect(() => this.actions$
    .pipe(ofType(StoreActionTypes.REHYDRATE),
      map(() => new ReinitMenuAction()),
    ));

  menuCollapsedStateToggle$ = createEffect(() => this.actions$.pipe(
    ofType(MenuActionTypes.TOGGLE_MENU),
    tap((action: ToggleMenuAction) => this.menuService.toggleMenuCollapsedState(action.menuID)),
  ), { dispatch: false });

  menuCollapsedStateCollapse$ = createEffect(() => this.actions$.pipe(
    ofType(MenuActionTypes.COLLAPSE_MENU),
    tap((action: CollapseMenuAction) => this.menuService.setMenuCollapsedState(action.menuID, true)),
  ), { dispatch: false });

  menuCollapsedStateExpand$ = createEffect(() => this.actions$.pipe(
    ofType(MenuActionTypes.EXPAND_MENU),
    tap((action: ExpandMenuAction) => this.menuService.setMenuCollapsedState(action.menuID, false)),
  ), { dispatch: false });

  constructor(
    private actions$: Actions,
    private menuService: MenuService,
  ) {
  }

}
