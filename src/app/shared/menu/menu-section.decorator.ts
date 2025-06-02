import { Component } from '@angular/core';

import { RENDERS_SECTION_FOR_MENU_MAP } from '../../../decorator-registries/renders-section-for-menu-registry';
import { GenericConstructor } from '../../core/shared/generic-constructor';
import { hasValue } from '../empty.util';
import {
  DEFAULT_THEME,
  getMatch,
} from '../object-collection/shared/listable-object/listable-object.decorator';
import { MenuID } from './menu-id.model';

/**
 * Decorator function to render a MenuSection for a menu
 * @param {MenuID} menuID The ID of the Menu in which the section is rendered
 * @param {boolean} expandable True when the section should be expandable, false when if should not
 * @param theme The optional theme for the component
 * @returns {(menuSectionWrapperComponent: GenericConstructor) => void}
 */
export function rendersSectionForMenu(menuID: MenuID, expandable: boolean, theme = DEFAULT_THEME) {
  return function decorator(menuSectionWrapperComponent: any) {
  };
}

/**
 * Retrieves the component matching the given MenuID and whether or not it should be expandable
 * @param {MenuID} menuID The ID of the Menu in which the section is rendered
 * @param {boolean} expandable True when the section should be expandable, false when if should not
 * @param theme The theme to match
 * @param registry The registry to search through. Defaults to RENDERS_SECTION_FOR_MENU_MAP, but other components can override this.
 * @returns {GenericConstructor} The constructor of the matching Component
 */
export function getComponentForMenu(menuID: MenuID, expandable: boolean, theme: string, registry = RENDERS_SECTION_FOR_MENU_MAP): Promise<GenericConstructor<Component>> {
  const match = getMatch(registry, [menuID, expandable, theme], [undefined, false, DEFAULT_THEME]);
  return hasValue(match) ? match.match() : undefined;
}
