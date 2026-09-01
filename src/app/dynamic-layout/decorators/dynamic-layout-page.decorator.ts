import { hasNoValue } from '@dspace/shared/utils/empty.util';

import { GenericConstructor } from '../../core/shared/generic-constructor';
import {
  DEFAULT_LAYOUT_PAGE,
  LayoutPage,
} from '../enums/layout-page.enum';

/**
 * Registry mapping {@link LayoutPage} orientation types to their page component.
 *
 * Entries are added dynamically at class-definition time by the
 * {@link dynamicLayoutPage} decorator, instead of being hardcoded here.
 */
const layoutPageMap = new Map<LayoutPage, GenericConstructor<any>>();

/**
 * Decorator used to register a component as the renderer for a given {@link LayoutPage} orientation.
 *
 * @param orientation the layout page orientation the decorated component renders
 */
export function dynamicLayoutPage(orientation: LayoutPage) {
  return function decorator(component: GenericConstructor<any>) {
    if (hasNoValue(orientation)) {
      return;
    }
    layoutPageMap.set(orientation, component);
  };
}

/**
 * Resolves the page layout component for the given orientation.
 * Falls back to {@link DEFAULT_LAYOUT_PAGE} if orientation is null or not registered.
 *
 * @param orientation the layout page orientation (horizontal or vertical)
 * @returns the component constructor for the requested orientation
 */
export function getDynamicLayoutPage(orientation: LayoutPage): any {
  let componentLayout;
  if (hasNoValue(orientation) || hasNoValue(layoutPageMap.get(orientation))) {
    componentLayout = layoutPageMap.get(DEFAULT_LAYOUT_PAGE);
  } else {
    componentLayout = layoutPageMap.get(orientation);
  }
  return componentLayout;
}
