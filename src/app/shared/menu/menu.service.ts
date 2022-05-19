import { Injectable } from '@angular/core';
import { createSelector, MemoizedSelector, select, Store } from '@ngrx/store';
import { AppState, keySelector } from '../../app.reducer';
import { combineLatest as observableCombineLatest, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import {
  ActivateMenuSectionAction,
  AddMenuSectionAction,
  CollapseMenuAction,
  CollapseMenuPreviewAction,
  DeactivateMenuSectionAction,
  ExpandMenuAction,
  ExpandMenuPreviewAction,
  HideMenuAction,
  RemoveMenuSectionAction,
  ShowMenuAction,
  ToggleActiveMenuSectionAction,
  ToggleMenuAction,
} from './menu.actions';
import { hasNoValue, hasValue, hasValueOperator, isNotEmpty } from '../empty.util';
import { MenuState } from './menu-state.model';
import { MenuSections } from './menu-sections.model';
import { MenuSection } from './menu-section.model';
import { MenuID } from './menu-id.model';

export function menuKeySelector<T>(key: string, selector): MemoizedSelector<MenuState, T> {
  return createSelector(selector, (state) => {
    if (hasValue(state)) {
      return state[key];
    } else {
      return undefined;
    }
  });
}

const menusStateSelector = (state) => state.menus;

const menuByIDSelector = (menuID: MenuID): MemoizedSelector<AppState, MenuState> => {
  return keySelector<MenuState>(menuID, menusStateSelector);
};

const menuSectionStateSelector = (state: MenuState) => hasValue(state) ? state.sections : {};

const menuSectionByIDSelector = (id: string): MemoizedSelector<MenuState, MenuSection> => {
  return menuKeySelector<MenuSection>(id, menuSectionStateSelector);
};

const menuSectionIndexStateSelector = (state: MenuState) => state.sectionToSubsectionIndex;

const getSubSectionsFromSectionSelector = (id: string): MemoizedSelector<MenuState, string[]> => {
  return menuKeySelector<string[]>(id, menuSectionIndexStateSelector);
};

@Injectable()
export class MenuService {

  constructor(private store: Store<AppState>) {
  }

  /**
   * Retrieve a menu's state by its ID
   * @param {MenuID} id ID of the requested Menu
   * @returns {Observable<MenuState>} Observable that emits the current state of the requested Menu
   */
  getMenu(id: MenuID): Observable<MenuState> {
    return this.store.pipe(select(menuByIDSelector(id)));
  }

  /**
   * Retrieve all top level sections of a certain menu
   * @param {MenuID} menuID ID of the Menu
   * @param {boolean} mustBeVisible True if you only want to request visible sections, false if you want to request all top level sections
   * @returns {Observable<MenuSection[]>} Observable that emits a list of MenuSections that are top sections of the given menu
   */
  getMenuTopSections(menuID: MenuID, mustBeVisible = true): Observable<MenuSection[]> {
    return this.store.pipe(
      select(menuByIDSelector(menuID)),
      select(menuSectionStateSelector),
      map((sections: MenuSections) => {
          return Object.values(sections)
            .filter((section: MenuSection) => hasNoValue(section.parentID))
            .filter((section: MenuSection) => !mustBeVisible || section.visible);
        }
      )
    );
  }

  /**
   * Retrieve all sub level sections of a certain top section in a given menu
   * @param {MenuID} menuID The ID of the menu
   * @param {string} parentID The ID of the parent section
   * @param {boolean} mustBeVisible True if you only want to request visible sections, false if you want to request all sections
   * @returns {Observable<MenuSection[]>} Observable that emits a list of MenuSections that are sub sections of the given menu and parent section
   */
  getSubSectionsByParentID(menuID: MenuID, parentID: string, mustBeVisible = true): Observable<MenuSection[]> {
    return this.store.pipe(
      select(menuByIDSelector(menuID)),
      select(getSubSectionsFromSectionSelector(parentID)),
      map((ids: string[]) => isNotEmpty(ids) ? ids : []),
      switchMap((ids: string[]) =>
        observableCombineLatest(ids.map((id: string) => this.getMenuSection(menuID, id)))
      ),
      map((sections: MenuSection[]) => sections.filter((section: MenuSection) => hasValue(section) && (!mustBeVisible || section.visible)))
    );
  }

  /**
   * Check if the a menu's top level section has subsections
   * @param {MenuID} menuID The ID of the Menu
   * @param {string} parentID The ID of the top level parent section
   * @returns {Observable<boolean>} Observable that emits true when the given parent section has sub sections, false if the given parent section does not have any sub sections
   */
  hasSubSections(menuID: MenuID, parentID: string): Observable<boolean> {
    return this.store.pipe(
      select(menuByIDSelector(menuID)),
      select(getSubSectionsFromSectionSelector(parentID)),
      map((ids: string[]) => isNotEmpty(ids))
    );
  }

  /**
   * Retrieve a specific menu section by its menu ID and section ID
   * @param {MenuID} menuID The ID of the menu the section resides in
   * @param {string} sectionId The ID of the requested section
   * @returns {Observable<MenuSection>} Observable that emits the found MenuSection
   */
  getMenuSection(menuID: MenuID, sectionId: string): Observable<MenuSection> {
    return this.store.pipe(
      select(menuByIDSelector(menuID)),
      select(menuSectionByIDSelector(sectionId)),
    );
  }

  /**
   * Retrieve menu sections that shouldn't persist on route change
   * @param menuID  The ID of the menu the sections reside in
   */
  getNonPersistentMenuSections(menuID: MenuID): Observable<MenuSection[]> {
    return this.getMenu(menuID).pipe(
      map((state: MenuState) => Object.values(state.sections).filter((section: MenuSection) => !section.shouldPersistOnRouteChange))
    );
  }

  /**
   * Add a new section to the store
   * @param {MenuID} menuID The menu to which the new section is to be added
   * @param {MenuSection} section The section to be added
   */
  addSection(menuID: MenuID, section: MenuSection) {
    this.store.dispatch(new AddMenuSectionAction(menuID, section));
  }

  /**
   * Remove a section from the store
   * @param {MenuID} menuID The menu from which the section is to be removed
   * @param {string} sectionID The ID of the section that should be removed
   */
  removeSection(menuID: MenuID, sectionID: string) {
    this.store.dispatch(new RemoveMenuSectionAction(menuID, sectionID));
  }

  /**
   * Check if a given menu is collapsed
   * @param {MenuID} menuID The ID of the menu that is to be checked
   * @returns {Observable<boolean>} Emits true if the given menu is collapsed, emits falls when it's expanded
   */
  isMenuCollapsed(menuID: MenuID): Observable<boolean> {
    return this.getMenu(menuID).pipe(
      map((state: MenuState) => hasValue(state) ? state.collapsed : undefined)
    );
  }

  /**
   * Check if a given menu's preview is collapsed
   * @param {MenuID} menuID The ID of the menu that is to be checked
   * @returns {Observable<boolean>} Emits true if the given menu's preview is collapsed, emits falls when it's expanded
   */
  isMenuPreviewCollapsed(menuID: MenuID): Observable<boolean> {
    return this.getMenu(menuID).pipe(
      map((state: MenuState) => hasValue(state) ? state.previewCollapsed : undefined)
    );
  }

  /**
   * Check if a given menu is visible
   * @param {MenuID} menuID The ID of the menu that is to be checked
   * @returns {Observable<boolean>} Emits true if the given menu is visible, emits falls when it's hidden
   */
  isMenuVisible(menuID: MenuID): Observable<boolean> {
    return this.getMenu(menuID).pipe(
      map((state: MenuState) => hasValue(state) ? state.visible : undefined)
    );
  }

  /**
   * Expands a given menu
   * @param {MenuID} menuID The ID of the menu
   */
  expandMenu(menuID: MenuID): void {
    this.store.dispatch(new ExpandMenuAction(menuID));
  }

  /**
   * Collapses a given menu
   * @param {MenuID} menuID The ID of the menu
   */
  collapseMenu(menuID: MenuID): void {
    this.store.dispatch(new CollapseMenuAction(menuID));
  }

  /**
   * Expands a given menu's preview
   * @param {MenuID} menuID The ID of the menu
   */
  expandMenuPreview(menuID: MenuID): void {
    this.store.dispatch(new ExpandMenuPreviewAction(menuID));
  }

  /**
   * Collapses a given menu's preview
   * @param {MenuID} menuID The ID of the menu
   */
  collapseMenuPreview(menuID: MenuID): void {
    this.store.dispatch(new CollapseMenuPreviewAction(menuID));
  }

  /**
   * Collapse a given menu when it's currently expanded or expand it when it's currently collapsed
   * @param {MenuID} menuID The ID of the menu
   */
  toggleMenu(menuID: MenuID): void {
    this.store.dispatch(new ToggleMenuAction(menuID));
  }

  /**
   * Show a given menu
   * @param {MenuID} menuID The ID of the menu
   */
  showMenu(menuID: MenuID): void {
    this.store.dispatch(new ShowMenuAction(menuID));
  }

  /**
   * Hide a given menu
   * @param {MenuID} menuID The ID of the menu
   */
  hideMenu(menuID: MenuID): void {
    this.store.dispatch(new HideMenuAction(menuID));
  }

  /**
   * Activate a given menu section when it's currently inactive or deactivate it when it's currently active
   * @param {MenuID} menuID The ID of the menu
   * @param {string} id The ID of the section
   */
  toggleActiveSection(menuID: MenuID, id: string): void {
    this.store.dispatch(new ToggleActiveMenuSectionAction(menuID, id));
  }

  /**
   * Activate a given menu section
   * @param {MenuID} menuID The ID of the menu
   * @param {string} id The ID of the section
   */
  activateSection(menuID: MenuID, id: string): void {
    this.store.dispatch(new ActivateMenuSectionAction(menuID, id));
  }

  /**
   * Deactivate a given menu section
   * @param {MenuID} menuID The ID of the menu
   * @param {string} id The ID of the section
   */
  deactivateSection(menuID: MenuID, id: string): void {
    this.store.dispatch(new DeactivateMenuSectionAction(menuID, id));
  }

  /**
   * Check whether a given section is currently active or not
   * @param {MenuID} menuID The ID of the Menu the section resides in
   * @param {string} id The ID of the menu section to check
   * @returns {Observable<boolean>} Emits true when the given section is currently active, false when the given section is currently inactive
   */
  isSectionActive(menuID: MenuID, id: string): Observable<boolean> {
    return this.getMenuSection(menuID, id).pipe(hasValueOperator(), map((section) => section.active));
  }

  /**
   * Check whether a given section is currently visible or not
   * @param {MenuID} menuID The ID of the Menu the section resides in
   * @param {string} id The ID of the menu section to check
   * @returns {Observable<boolean>} Emits true when the given section is currently visible, false when the given section is currently hidden
   */
  isSectionVisible(menuID: MenuID, id: string): Observable<boolean> {
    return this.getMenuSection(menuID, id).pipe(map((section) => section.visible));
  }

}
