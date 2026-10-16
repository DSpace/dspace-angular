import {
  hasValue,
  isEmpty,
} from '@dspace/shared/utils/empty.util';

import { FieldRenderingType } from './field-rendering-type';
import { MetadataBoxFieldRenderOptions } from './rendering-type.directive';

/**
 * Decorator to register a component as a metadata box field rendering component
 * for a given rendering type.
 *
 * @param renderingType The rendering type this component handles
 * @param structured Whether this rendering type handles all metadata values in a single structured render
 */
export function MetadataBoxFieldRendering(renderingType: FieldRenderingType | string, structured = false) {
  return function decorator(component: any): void {};
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
 * Return the rendering option related to the given rendering type (synchronous, map-based).
 * @param layoutBoxesMap
 * @param fieldRenderingType
 */
export const getMetadataBoxFieldRenderOptionsFn = (layoutBoxesMap: Map<FieldRenderingType, MetadataBoxFieldRenderOptions>, fieldRenderingType: string): MetadataBoxFieldRenderOptions => {
  let renderOptions = layoutBoxesMap.get(fieldRenderingType?.toUpperCase() as FieldRenderingType);
  // If the rendering type not exists will use TEXT type rendering
  if (isEmpty(renderOptions)) {
    renderOptions = layoutBoxesMap.get(FieldRenderingType.TEXT);
  }
  return renderOptions;
};



