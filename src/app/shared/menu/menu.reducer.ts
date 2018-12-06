import {
  ActivateMenuSectionAction,
  AddMenuSectionAction, DeactivateMenuSectionAction,
  HideMenuSectionAction,
  MenuAction,
  MenuActionTypes,
  MenuSectionAction,
  RemoveMenuSectionAction,
  ShowMenuSectionAction, ToggleActiveMenuSectionAction
} from './menu.actions';
import { initialMenusState, MenuID, SectionType } from './initial-menus-state';
import { hasValue } from '../empty.util';
import { SectionTypeModel } from './models/section-types/section-type.model';

export type MenusState = {
  [id in MenuID]: MenuState;
}

export interface MenuState {
  id: MenuID;
  collapsed: boolean;
  visible: boolean;
  sections: MenuSections
  sectionToSubsectionIndex: MenuSectionIndex;
}

export interface MenuSectionIndex {
  [id: string]: string[]
}

export interface MenuSections {
  [id: string]: MenuSection;
}

export class MenuSection {
  id: string;
  parentID?: string;
  visible: boolean;
  active: boolean;
  model: SectionTypeModel;
  index?: number;
  icon?: string;
}

export function menusReducer(state: MenusState = initialMenusState, action: MenuAction): MenusState {
  const menuState: MenuState = state[action.menuID];
  switch (action.type) {
    case MenuActionTypes.COLLAPSE_MENU: {
      const newMenuState = Object.assign({}, menuState, { collapsed: true });
      return Object.assign({}, state, { [action.menuID]: newMenuState });
    }
    case MenuActionTypes.EXPAND_MENU: {
      const newMenuState = Object.assign({}, menuState, { collapsed: false });
      return Object.assign({}, state, { [action.menuID]: newMenuState });
    }
    case MenuActionTypes.TOGGLE_MENU: {
      const newMenuState = Object.assign({}, menuState, { collapsed: !menuState.collapsed });
      return Object.assign({}, state, { [action.menuID]: newMenuState });
    }
    case MenuActionTypes.SHOW_MENU: {
      const newMenuState = Object.assign({}, menuState, { visible: true });
      return Object.assign({}, state, { [action.menuID]: newMenuState });
    }
    case MenuActionTypes.HIDE_MENU: {
      const newMenuState = Object.assign({}, menuState, { visible: false });
      return Object.assign({}, state, { [action.menuID]: newMenuState });
    }
    case MenuActionTypes.ADD_SECTION: {
      return addSection(state, action as AddMenuSectionAction);
    }
    case MenuActionTypes.REMOVE_SECTION: {
      return removeSection(state, action as RemoveMenuSectionAction);
    }
    case MenuActionTypes.ACTIVATE_SECTION: {
      return activateSection(state, action as ActivateMenuSectionAction);
    }
    case MenuActionTypes.DEACTIVATE_SECTION: {
      return deactivateSection(state, action as DeactivateMenuSectionAction);
    }
    case MenuActionTypes.TOGGLE_ACTIVE_SECTION: {
      return toggleActiveSection(state, action as ToggleActiveMenuSectionAction);
    }
    case MenuActionTypes.HIDE_SECTION: {
      return hideSection(state, action as HideMenuSectionAction);
    }
    case MenuActionTypes.SHOW_SECTION: {
      return showSection(state, action as ShowMenuSectionAction);
    }

    default: {
      return state;
    }
  }
}

function addSection(state: MenusState, action: AddMenuSectionAction) {
  // let newState = addToIndex(state, action.section, action.menuID);
  const newState = putSectionState(state, action, action.section);
  return reorderSections(newState, action)
}

function reorderSections(state: MenusState, action: MenuSectionAction) {
  const menuState: MenuState = state[action.menuID];
  const newSectionState: MenuSections = {};
  const newSectionIndexState: MenuSectionIndex = {};
  Object.values(menuState.sections).sort((sectionA: MenuSection, sectionB: MenuSection) => {
    const indexA = sectionA.index || 0;
    const indexB = sectionB.index || 0;
    return indexA - indexB;
  }).forEach((section: MenuSection) => {
    newSectionState[section.id] = section;
    if (hasValue(section.parentID)) {
      const parentIndex = hasValue(newSectionIndexState[section.parentID]) ? newSectionIndexState[section.parentID] : [];
      newSectionIndexState[section.parentID] = [...parentIndex, section.id];
    }
  });
  const newMenuState = Object.assign({}, menuState, {
    sections: newSectionState,
    sectionToSubsectionIndex: newSectionIndexState
  });
  return Object.assign({}, state, { [action.menuID]: newMenuState });
}

function removeSection(state: MenusState, action: RemoveMenuSectionAction) {
  const menuState: MenuState = state[action.menuID];
  const id = action.id;
  const newMenuState = Object.assign({}, menuState);
  delete newMenuState[id];
  const newState = removeFromIndex(state, menuState.sections[action.id], action.menuID);
  return Object.assign({}, newState, { [action.menuID]: newMenuState });
}

function removeFromIndex(state: MenusState, section: MenuSection, menuID: MenuID) {
  const sectionID = section.id;
  const parentID = section.parentID;
  if (hasValue(parentID)) {
    const menuState: MenuState = state[menuID];
    const index = menuState.sectionToSubsectionIndex;
    const parentIndex = hasValue(index[parentID]) ? index[parentID] : [];
    const newIndex = Object.assign({}, index, { [parentID]: parentIndex.filter((id) => id === sectionID) });
    const newMenuState = Object.assign({}, menuState, { sectionToSubsectionIndex: newIndex });
    return Object.assign({}, state, { [menuID]: newMenuState });
  }
  return state;
}

function hideSection(state: MenusState, action: HideMenuSectionAction) {
  return updateSectionState(state, action, { visible: false });
}

function showSection(state: MenusState, action: ShowMenuSectionAction) {
  return updateSectionState(state, action, { visible: true });
}

function deactivateSection(state: MenusState, action: DeactivateMenuSectionAction) {
  const sectionState: MenuSection = state[action.menuID].sections[action.id];
  if (hasValue(sectionState)) {
    return updateSectionState(state, action, { active: false });
  }
}

function activateSection(state: MenusState, action: ActivateMenuSectionAction) {
  const sectionState: MenuSection = state[action.menuID].sections[action.id];
  if (hasValue(sectionState)) {
    return updateSectionState(state, action, { active: true });
  }
}

function toggleActiveSection(state: MenusState, action: ToggleActiveMenuSectionAction) {
  const sectionState: MenuSection = state[action.menuID].sections[action.id];
  if (hasValue(sectionState)) {
    return updateSectionState(state, action, { active: !sectionState.active });
  }
  return state;
}

function putSectionState(state: MenusState, action: MenuAction, section: MenuSection): MenusState {
  const menuState: MenuState = state[action.menuID];
  const newSections = Object.assign({}, menuState.sections, {
    [section.id]: section
  });
  const newMenuState = Object.assign({}, menuState, {
    sections: newSections
  });
  return Object.assign({}, state, { [action.menuID]: newMenuState });
}

function updateSectionState(state: MenusState, action: MenuSectionAction, update: any): MenusState {
  const menuState: MenuState = state[action.menuID];
  const sectionState = menuState.sections[action.id];
  if (hasValue(sectionState)) {
    const newTopSection = Object.assign({}, sectionState, update);
    return putSectionState(state, action, newTopSection);

  }
  return state;
}
