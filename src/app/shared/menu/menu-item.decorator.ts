import { Component } from '@angular/core';

import { RENDERS_MENU_ITEM_FOR_TYPE_MAP } from '../../../decorator-registries/renders-menu-item-for-type-registry';
import { GenericConstructor } from '../../core/shared/generic-constructor';
import { hasValue } from '../empty.util';
import {
  DEFAULT_THEME,
  getMatch,
} from '../object-collection/shared/listable-object/listable-object.decorator';
import { MenuItemType } from './menu-item-type.model';

export const DEFAULT_MENU_TYPE = MenuItemType.TEXT;

/**
 * Decorator function to link a {@link MenuItemType} to a Component
 *
 * @param type The {@link MenuItemType} of the {@link MenuItemModel}
 * @param theme The theme of the {@link MenuItemModel}
 */
export function rendersMenuItemForType(type: MenuItemType = DEFAULT_MENU_TYPE, theme: string = DEFAULT_THEME) {
  return function decorator(sectionComponent: any): void {
  };
}

/**
 * Retrieves the Component matching a given {@link MenuItemType}
 *
 * @param type The given {@link MenuItemType}
 * @param theme The theme to match
 * @param registry The registry to search through. Defaults to RENDERS_MENU_ITEM_FOR_TYPE_MAP, but other components can override this.
 * @returns The constructor of the Component that matches the {@link MenuItemType}
 */
export function getComponentForMenuItemType(type: MenuItemType, theme: string, registry = RENDERS_MENU_ITEM_FOR_TYPE_MAP): Promise<GenericConstructor<Component>> {
  const match = getMatch(registry, [type, theme], [DEFAULT_MENU_TYPE, DEFAULT_THEME]);
  return hasValue(match) ? match.match() : undefined;
}
