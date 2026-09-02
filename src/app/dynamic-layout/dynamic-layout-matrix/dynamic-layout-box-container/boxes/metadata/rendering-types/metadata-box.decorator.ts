import { GenericConstructor } from '@dspace/core/shared/generic-constructor';
import { hasValue } from '@dspace/shared/utils/empty.util';

import { METADATA_BOX_FIELD_RENDERING_MAP } from '../../../../../../../decorator-registries/metadata-box-field-rendering-registry';
import { getMatch } from '../../../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { FieldRenderingType } from './field-rendering-type';
import { RenderingTypeDirective } from './rendering-type.directive';

/**
 * Whether a rendering type renders all metadata values in a single structured render (`true`),
 * or renders each metadata value individually (`false`).
 */
export const DEFAULT_METADATA_BOX_STRUCTURED = false;

/**
 * Marker decorator used to register a component as the renderer for a given {@link FieldRenderingType}.
 *
 * The actual registry ({@link METADATA_BOX_FIELD_RENDERING_MAP}) is generated at build time by
 * `scripts/generate-decorator-registries.ts` from these decorator usages, so this function is a no-op
 * at runtime and only serves as metadata for the generator.
 *
 * @param fieldRenderingType the field rendering type the decorated component renders
 * @param structured whether the component renders all metadata values in a single structured render
 */
export function metadataBoxFieldRendering(fieldRenderingType: FieldRenderingType, structured: boolean = DEFAULT_METADATA_BOX_STRUCTURED) {
  return function decorator(component: GenericConstructor<RenderingTypeDirective>) {
    /* intentionally empty: the registry is generated at build time */
  };
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
 * Resolve the rendering component for the given rendering type.
 *
 * Falls back to the {@link FieldRenderingType.TEXT} component when the rendering type is not registered.
 *
 * @param fieldRenderingType the rendering type to look up
 * @param structured whether to look up the structured variant of the rendering type
 * @param registry the registry containing all the rendering components
 * @returns a promise resolving to the matching rendering component, or undefined if none is registered
 */
export const getMetadataBoxFieldRenderOptionsFn = (
  fieldRenderingType: string,
  structured: boolean = DEFAULT_METADATA_BOX_STRUCTURED,
  registry: Map<any, any> = METADATA_BOX_FIELD_RENDERING_MAP,
): Promise<GenericConstructor<RenderingTypeDirective>> => {
  const match = getMatch(
    registry,
    [fieldRenderingType?.toUpperCase(), structured],
    [FieldRenderingType.TEXT, DEFAULT_METADATA_BOX_STRUCTURED],
  );
  return hasValue(match) ? (match.match() as Promise<GenericConstructor<RenderingTypeDirective>>) : undefined;
};
