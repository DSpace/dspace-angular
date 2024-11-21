import {
  hasValue,
  isEmpty,
} from '../../../../../../shared/empty.util';
import { FieldRenderingType } from './field-rendering-type';
import { MetadataBoxFieldRenderOptions } from './rendering-type.model';

export const computeRenderingFn = (rendering: string): string | FieldRenderingType => {
  let renderingType = hasValue(rendering) ? rendering : FieldRenderingType.TEXT;

  if (renderingType.indexOf('.') > -1) {
    const values = renderingType.split('.');
    renderingType = values[0];
  }
  return renderingType;
};

/**
 * Return the rendering option related to the given rendering type
 * @param layoutBoxesMap
 * @param fieldRenderingType
 */
export const getMetadataBoxFieldRenderOptionsFn = (layoutBoxesMap: Map<FieldRenderingType, MetadataBoxFieldRenderOptions>, fieldRenderingType: string): MetadataBoxFieldRenderOptions => {
  console.log(fieldRenderingType);
  let renderOptions = layoutBoxesMap.get(fieldRenderingType?.toUpperCase() as FieldRenderingType);
  // If the rendering type not exists will use TEXT type rendering
  if (isEmpty(renderOptions)) {
    renderOptions = layoutBoxesMap.get(FieldRenderingType.TEXT);
  }
  return renderOptions;
};
