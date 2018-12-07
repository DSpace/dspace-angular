import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/index';
import { filter, first, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {
  ActivateMenuSectionAction,
  CollapseMenuAction,
  DeactivateMenuSectionAction,
  ExpandMenuAction,
  MenuActionTypes,
  ToggleActiveMenuSectionAction,
  ToggleMenuAction,
} from './menu.actions';
import { MenuState } from './menu.reducer';
import { MenuService } from './menu.service';

@Injectable()
export class MenuEffects {
  //
  // @Effect()
  // public collapseSectionsOnCollapseMenu$: Observable<Action> = this.actions$.pipe(
  //   ofType(MenuActionTypes.COLLAPSE_MENU, MenuActionTypes.TOGGLE_MENU),
  //   switchMap((action: CollapseMenuAction | ToggleMenuAction) => {
  //     return this.menuService.getMenu(action.menuID).pipe(
  //       first(),
  //       switchMap((menu: MenuState) => {
  //           if (menu.collapsed) {
  //             const sections = menu.sections;
  //             return Object.keys(sections)
  //               .map((id) => {
  //                   return new DeactivateMenuSectionAction(action.menuID, id);
  //                 }
  //               )
  //           } else {
  //             return [{ type: 'NO_ACTION' }];
  //           }
  //         }
  //       )
  //     )
  //   })
  // );

  // @Effect()
  // public onExpandSectionMenuExpandMenu: Observable<Action> = this.actions$.pipe(
  //   ofType(MenuActionTypes.ACTIVATE_SECTION, MenuActionTypes.TOGGLE_ACTIVE_SECTION),
  //   switchMap((action: ActivateMenuSectionAction | ToggleActiveMenuSectionAction) => {
  //     return this.menuService.getMenu(action.menuID).pipe(
  //       first(),
  //       map((menu: MenuState) => {
  //         if (menu.collapsed) {
  //           return new ExpandMenuAction(menu.id)
  //         } else {
  //           return { type: 'NO_ACTION' };
  //         }
  //       }));
  //   })
  // );

  constructor(private actions$: Actions,
              private menuService: MenuService) {
  }
}