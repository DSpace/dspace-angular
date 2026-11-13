import { hasValue } from '@dspace/shared/utils/empty.util';

import { RENDER_DYNAMIC_LAYOUT_BOX_FOR_MAP } from '../../../decorator-registries/render-dynamic-layout-box-for-registry';
import { GenericConstructor } from '../../core/shared/generic-constructor';
import { LayoutBox } from '../enums/layout-box.enum';

/**
 * The type of component a layout box can be rendered with.
 *
 * The registry is heterogeneous: most boxes extend {@link DynamicLayoutBoxDirective},
 * but some (e.g. VERSIONING) are rendered with a standalone component that does not,
 * so a generic constructor type is used here.
 */
type DynamicLayoutBoxComponent = GenericConstructor<any>;

/**
 * Marker decorator used to register a component as the renderer for a given {@link LayoutBox} type.
 *
 * The actual registry ({@link RENDER_DYNAMIC_LAYOUT_BOX_FOR_MAP}) is generated at build time by
 * `scripts/generate-decorator-registries.ts` from these decorator usages, so this function is a no-op
 * at runtime and only serves as metadata for the generator.
 *
 * Components extending {@link DynamicLayoutBoxDirective} inherit a static
 * `hasOwnContainer` flag (default `false`). If a component provides its own
 * wrapping container (e.g. accordion), override it with
 * `static override hasOwnContainer = true;` in the component class.
 *
 * @param boxType the layout box type the decorated component renders
 */
export function renderDynamicLayoutBoxFor(boxType: LayoutBox) {
  return function decorator(component: DynamicLayoutBoxComponent) {
  };
}

/**
 * Resolves the rendering component for a given box type.
 *
 * @param boxType the layout box type to look up
 * @param registry the registry containing all the box rendering components
 * @returns a promise resolving to the component constructor for the box type,
 *          or undefined if not registered
 */
export function getDynamicLayoutBox(
  boxType: LayoutBox,
  registry: Map<LayoutBox, () => Promise<DynamicLayoutBoxComponent>> = RENDER_DYNAMIC_LAYOUT_BOX_FOR_MAP,
): Promise<DynamicLayoutBoxComponent> {
  const loader = registry.get(boxType);
  return hasValue(loader) ? loader() : undefined;
}
