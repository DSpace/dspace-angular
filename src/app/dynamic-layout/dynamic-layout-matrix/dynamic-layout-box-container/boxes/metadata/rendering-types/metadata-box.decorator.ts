import { GenericConstructor } from '@dspace/core/shared/generic-constructor';
import {
  hasNoValue,
  hasValue,
  isEmpty,
} from '@dspace/shared/utils/empty.util';

import { FieldRenderingType } from './field-rendering-type';
import { RenderingTypeDirective } from './rendering-type.directive';

/**
 * Registry mapping {@link FieldRenderingType} values to their rendering component.
 *
 * Entries are added dynamically at class-definition time by the
 * {@link metadataBoxFieldRendering} decorator, instead of being hardcoded in a map.
 */
const metadataBoxFieldRenderMap = new Map<FieldRenderingType, GenericConstructor<RenderingTypeDirective>>();

/**
 * Decorator used to register a component as the renderer for a given {@link FieldRenderingType}.
 *
 * @param fieldRenderingType the field rendering type the decorated component renders
 */
export function metadataBoxFieldRendering(fieldRenderingType: FieldRenderingType) {
  return function decorator(component: GenericConstructor<RenderingTypeDirective>) {
    if (hasNoValue(fieldRenderingType)) {
      return;
    }
    metadataBoxFieldRenderMap.set(fieldRenderingType, component);
  };
}

/**
 * Returns the registry of {@link FieldRenderingType} to their rendering component,
 * populated by the {@link metadataBoxFieldRendering} decorator.
 *
 * @returns the map of rendering types to rendering components
 */
export function getMetadataBoxFieldRenderMap(): Map<FieldRenderingType, GenericConstructor<RenderingTypeDirective>> {
  return metadataBoxFieldRenderMap;
}

/**
 * Return the rendering type of the field to render
 *
 * @return the rendering type
 */
export const computeRenderingFn = (rendering: string, isSubtype = false): string | FieldRenderingType => {
  let renderingType = hasValue(rendering) ? rendering : FieldRenderingType.TEXT;

  if (renderingType.indexOf('.') > -1) {
    const values = renderingType.split('.');
    renderingType = isSubtype ? values[1] : values[0];
  }
  return renderingType;
};

/**
 * Return the rendering component related to the given rendering type
 * @param layoutBoxesMap
 * @param fieldRenderingType
 */
export const getMetadataBoxFieldRenderOptionsFn = (layoutBoxesMap: Map<FieldRenderingType, GenericConstructor<RenderingTypeDirective>>, fieldRenderingType: string): GenericConstructor<RenderingTypeDirective> => {
  let renderOptions = layoutBoxesMap.get(fieldRenderingType?.toUpperCase() as FieldRenderingType);
  // If the rendering type not exists will use TEXT type rendering
  if (isEmpty(renderOptions)) {
    renderOptions = layoutBoxesMap.get(FieldRenderingType.TEXT);
  }
  return renderOptions;
};
