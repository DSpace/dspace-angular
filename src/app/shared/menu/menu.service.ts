import { Injectable } from '@angular/core';
import { MemoizedSelector, select, Store } from '@ngrx/store';
import { MenuSection, MenuSectionIndex, MenuSections, MenusState, MenuState } from './menu.reducer';
import { AppState, keySelector } from '../../app.reducer';
import { MenuID } from './initial-menus-state';
import { Observable } from 'rxjs/internal/Observable';
import { distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import {
  AddMenuSectionAction,
  RemoveMenuSectionAction,
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

  getMenuTopSections(menuID: MenuID): Observable<MenuSection[]> {
    return this.store.pipe(
      select(menuByIDSelector(menuID)),
      select(menuSectionStateSelector),
      map((sections: MenuSections) => {
          return Object.values(sections).filter((section: MenuSection) => hasNoValue(section.parentID))
        }
      )
    );
  }

  getSubSectionsByParentID(menuID: MenuID, parentID: string): Observable<MenuSection[]> {
    return this.store.pipe(
      select(menuByIDSelector(menuID)),
      select(getSubSectionsFromSectionSelector(parentID)),
      map((ids: string[]) => isNotEmpty(ids) ? ids : []),
      switchMap((ids: string[]) => observableCombineLatest(ids.map((id: string) => this.getMenuSection(menuID, id)))),
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

  toggleMenu(menuID: MenuID): void {
    this.store.dispatch(new ToggleMenuAction(menuID));
  }

  toggleActiveSection(menuID: MenuID, id: string): void {
    this.store.dispatch(new ToggleActiveMenuSectionAction(menuID, id));
  }

  isSectionActive(menuID: MenuID, id: string): Observable<boolean> {
    return this.getMenuSection(menuID, id).pipe(tap((section) => console.log(section.id)), map((section) => section.active),
      distinctUntilChanged((a, b) => {
        console.log('DISTINCT', a, b);
        return a === b
      }));
  }

  isSectionVisible(menuID: MenuID, id: string): Observable<boolean> {
    return this.getMenuSection(menuID, id).pipe(map((section) => section.visible));
  }

}
