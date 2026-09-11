import { Component } from '@angular/core';
import { GenericConstructor } from '@dspace/core/shared/generic-constructor';
import { hasValue } from '@dspace/shared/utils/empty.util';

import { RENDER_DYNAMIC_LAYOUT_BOX_FOR_MAP } from '../../../decorator-registries/render-dynamic-layout-box-for-registry';
import { LayoutBox } from '../enums/layout-box.enum';
import { DynamicLayoutBoxDirective } from '../models/dynamic-layout-box-component.directive';

/**
 * Render options for a dynamic layout box component.
 */
export interface DynamicLayoutBoxRenderOptions {
  /** The component class to instantiate for this box type. */
  componentRef: GenericConstructor<DynamicLayoutBoxDirective | Component>;
}

/**
 * Decorator to register a component as the renderer for a given layout box type.
 *
 * @param boxType The {@link LayoutBox} type this component renders
 */
export function RenderDynamicLayoutBoxFor(boxType: LayoutBox | string) {
  return function decorator(component: any): void {
  };
}

/**
 * Resolves the rendering component for a given box type using the auto-generated registry.
 *
 * @param boxType the layout box type to look up
 * @returns a Promise resolving to the render options, or undefined if not registered
 */
export async function getDynamicLayoutBox(boxType: LayoutBox | string): Promise<DynamicLayoutBoxRenderOptions> {
  const lazyImport = RENDER_DYNAMIC_LAYOUT_BOX_FOR_MAP.get(boxType);
  if (hasValue(lazyImport)) {
    const componentRef = await lazyImport() as GenericConstructor<Component>;
    return { componentRef } as DynamicLayoutBoxRenderOptions;
  }
  return undefined;
}
