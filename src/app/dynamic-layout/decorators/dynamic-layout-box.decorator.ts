import { hasNoValue } from '@dspace/shared/utils/empty.util';

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
 * Registry mapping {@link LayoutBox} types to their rendering component.
 *
 * Entries are added dynamically at class-definition time by the
 * {@link renderDynamicLayoutBoxFor} decorator, instead of being hardcoded here.
 */
const layoutBoxesMap = new Map<LayoutBox, DynamicLayoutBoxComponent>();

/**
 * Decorator used to register a component as the renderer for a given {@link LayoutBox} type.
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
    if (hasNoValue(boxType)) {
      return;
    }
    layoutBoxesMap.set(boxType, component);
  };
}

/**
 * Resolves the rendering component for a given box type.
 *
 * @param boxType the layout box type to look up
 * @returns the component constructor for the box type, or undefined if not registered
 */
export function getDynamicLayoutBox(boxType: LayoutBox): DynamicLayoutBoxComponent {
  return layoutBoxesMap.get(boxType);
}
