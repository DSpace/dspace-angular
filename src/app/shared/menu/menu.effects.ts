import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType, } from '@ngrx/effects';
import { tap } from 'rxjs/operators';

import { MenuActionTypes, ToggleMenuAction, CollapseMenuAction, ExpandMenuAction } from './menu.actions';
import { MenuService } from './menu.service';

@Injectable()
export class MenuEffects {

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
