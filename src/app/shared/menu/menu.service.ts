import { Injectable } from '@angular/core';
import { MemoizedSelector, select, Store } from '@ngrx/store';
import { MenuSection, MenuSectionIndex, MenuSections, MenusState, MenuState } from './menu.reducer';
import { AppState, keySelector } from '../../app.reducer';
import { MenuID } from './initial-menus-state';
import { Observable } from 'rxjs/internal/Observable';
import { map, switchMap } from 'rxjs/operators';
import {
  ActivateMenuSectionAction,
  AddMenuSectionAction, DeactivateMenuSectionAction, HideMenuAction,
  RemoveMenuSectionAction, ShowMenuAction,
  ToggleActiveMenuSectionAction,
  ToggleMenuAction,
} from './menu.actions';
import { hasNoValue, isNotEmpty } from '../empty.util';
import { combineLatest as observableCombineLatest } from 'rxjs';

const menusStateSelector = (state) => state.menus;

const menuByIDSelector = (menuID: MenuID): MemoizedSelector<AppState, MenuState> => {
  return keySelector<MenuState>(menuID, menusStateSelector);
};

const menuSectionStateSelector = (state: MenuState) => state.sections;

const menuSectionByIDSelector = (id: string): MemoizedSelector<AppState, MenuSection> => {
  return keySelector<MenuSection>(id, menuSectionStateSelector);
};

const menuSectionIndexStateSelector = (state: MenuState) => state.sectionToSubsectionIndex;

const getSubSectionsFromSectionSelector = (id: string): MemoizedSelector<AppState, MenuSectionIndex> => {
  return keySelector<MenuSectionIndex>(id, menuSectionIndexStateSelector);
};

@Injectable()
export class MenuService {

  constructor(private store: Store<MenusState>) {
  }

  getMenu(id: MenuID): Observable<MenuState> {
    return this.store.pipe(select(menuByIDSelector(id)));
  }

  getMenuTopSections(menuID: MenuID, mustBeVisible = true): Observable<MenuSection[]> {
    return this.store.pipe(
      select(menuByIDSelector(menuID)),
      select(menuSectionStateSelector),
      map((sections: MenuSections) => {
          return Object.values(sections)
            .filter((section: MenuSection) => hasNoValue(section.parentID))
            .filter((section: MenuSection) => !mustBeVisible || section.visible)
        }
      )
    );
  }

  getSubSectionsByParentID(menuID: MenuID, parentID: string, mustBeVisible = true): Observable<MenuSection[]> {
    return this.store.pipe(
      select(menuByIDSelector(menuID)),
      select(getSubSectionsFromSectionSelector(parentID)),
      map((ids: string[]) => isNotEmpty(ids) ? ids : []),
      switchMap((ids: string[]) =>
        observableCombineLatest(ids.map((id: string) => this.getMenuSection(menuID, id)))
      ),
      map((sections: MenuSection[]) => sections.filter((section: MenuSection) => !mustBeVisible || section.visible))
    );
  }

  hasSubSections(menuID: MenuID, parentID: string): Observable<boolean> {
    return this.store.pipe(
      select(menuByIDSelector(menuID)),
      select(getSubSectionsFromSectionSelector(parentID)),
      map((ids: string[]) => isNotEmpty(ids))
    );
  }

  getMenuSection(menuID: MenuID, sectionId: string): Observable<MenuSection> {
    return this.store.pipe(
      select(menuByIDSelector(menuID)),
      select(menuSectionByIDSelector(sectionId)),
    );
  }

  addSection(menuID: MenuID, section: MenuSection) {
    this.store.dispatch(new AddMenuSectionAction(menuID, section));
  }

  removeSection(menuID: MenuID, sectionID: string) {
    this.store.dispatch(new RemoveMenuSectionAction(menuID, sectionID));
  }

  isMenuCollapsed(menuID: MenuID): Observable<boolean> {
    return this.getMenu(menuID).pipe(
      map((state: MenuState) => state.collapsed)
    );
  }

  isMenuVisible(menuID: MenuID): Observable<boolean> {
    return this.getMenu(menuID).pipe(
      map((state: MenuState) => state.visible)
    );
  }

  toggleMenu(menuID: MenuID): void {
    this.store.dispatch(new ToggleMenuAction(menuID));
  }

  showMenu(menuID: MenuID): void {
    this.store.dispatch(new ShowMenuAction(menuID));
  }

  hideMenu(menuID: MenuID): void {
    this.store.dispatch(new HideMenuAction(menuID));
  }

  toggleActiveSection(menuID: MenuID, id: string): void {
    this.store.dispatch(new ToggleActiveMenuSectionAction(menuID, id));
  }

  activateSection(menuID: MenuID, id: string): void {
    this.store.dispatch(new ActivateMenuSectionAction(menuID, id));
  }

  deactivateSection(menuID: MenuID, id: string): void {
    this.store.dispatch(new DeactivateMenuSectionAction(menuID, id));
  }

  isSectionActive(menuID: MenuID, id: string): Observable<boolean> {
    return this.getMenuSection(menuID, id).pipe(map((section) => section.active));
  }

  isSectionVisible(menuID: MenuID, id: string): Observable<boolean> {
    return this.getMenuSection(menuID, id).pipe(map((section) => section.visible));
  }

}
