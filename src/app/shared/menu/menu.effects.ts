import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType, } from '@ngrx/effects';
import { tap } from 'rxjs/operators';

import { MenuActionTypes } from './menu.actions';
import { MenuService } from './menu.service';
import { MenuID } from './menu-id.model';

@Injectable()
export class MenuEffects {

  adminSidebarToggle$ = createEffect(() => this.actions$.pipe(
    ofType(MenuActionTypes.TOGGLE_MENU),
    tap(() => this.menuService.toggleMenuCollapsedState(MenuID.ADMIN)),
  ), { dispatch: false });

  constructor(
    private actions$: Actions,
    private menuService: MenuService,
  ) {
  }

}
