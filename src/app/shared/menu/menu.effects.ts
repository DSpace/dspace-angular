import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType, } from '@ngrx/effects';
import { tap } from 'rxjs/operators';

import { MenuActionTypes, ToggleMenuAction } from './menu.actions';
import { MenuService } from './menu.service';
import { Action } from '@ngrx/store';

@Injectable()
export class MenuEffects {

  menuCollapsedStateToggle$ = createEffect(() => this.actions$.pipe(
    ofType(MenuActionTypes.TOGGLE_MENU),
    tap((action: Action) => this.menuService.toggleMenuCollapsedState((action as ToggleMenuAction).menuID)),
  ), { dispatch: false });

  constructor(
    private actions$: Actions,
    private menuService: MenuService,
  ) {
  }

}
