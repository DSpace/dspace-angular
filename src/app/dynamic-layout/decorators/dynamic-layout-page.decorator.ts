import { hasValue } from '@dspace/shared/utils/empty.util';

import { DYNAMIC_LAYOUT_PAGE_MAP } from '../../../decorator-registries/dynamic-layout-page-registry';
import { GenericConstructor } from '../../core/shared/generic-constructor';
import {
  DEFAULT_LAYOUT_PAGE,
  LayoutPage,
} from '../enums/layout-page.enum';

/**
 * Marker decorator used to register a component as the renderer for a given {@link LayoutPage} orientation.
 *
 * The actual registry ({@link DYNAMIC_LAYOUT_PAGE_MAP}) is generated at build time by
 * `scripts/generate-decorator-registries.ts` from these decorator usages, so this function is a no-op
 * at runtime and only serves as metadata for the generator.
 *
 * @param orientation the layout page orientation the decorated component renders
 */
export function dynamicLayoutPage(orientation: LayoutPage) {
  return function decorator(component: GenericConstructor<any>) {
    /* intentionally empty: the registry is generated at build time */
  };
}

/**
 * Resolves the page layout component for the given orientation.
 * Falls back to {@link DEFAULT_LAYOUT_PAGE} if orientation is null or not registered.
 *
 * @param orientation the layout page orientation (horizontal or vertical)
 * @param registry the registry containing all the layout page components
 * @returns a promise resolving to the component constructor for the requested orientation,
 *          or undefined if neither the orientation nor the default is registered
 */
export function getDynamicLayoutPage(
  orientation: LayoutPage,
  registry: Map<LayoutPage, () => Promise<GenericConstructor<any>>> = DYNAMIC_LAYOUT_PAGE_MAP,
): Promise<GenericConstructor<any>> {
  const loader = (hasValue(orientation) && hasValue(registry.get(orientation)))
    ? registry.get(orientation)
    : registry.get(DEFAULT_LAYOUT_PAGE);
  return hasValue(loader) ? loader() : undefined;
}
