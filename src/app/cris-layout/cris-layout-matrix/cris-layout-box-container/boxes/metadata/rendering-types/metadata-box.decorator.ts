import {
  hasValue,
  isEmpty,
} from '../../../../../../shared/empty.util';
import { FieldRenderingType } from './field-rendering-type';
import { MetadataBoxFieldRenderOptions } from './rendering-type.model';

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
 * Return the rendering option related to the given rendering type
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
