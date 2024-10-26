import { hasNoValue, hasValue } from '../../../../shared/empty.util';
import { Context } from '../../../../core/shared/context.model';
import { resolveTheme, DEFAULT_THEME, DEFAULT_CONTEXT, } from '../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { EditMetadataValueFieldType } from '../dso-edit-metadata-field-type.enum';

export const map = new Map();

export const DEFAULT_EDIT_METADATA_FIELD_TYPE = EditMetadataValueFieldType.PLAIN_TEXT;

/**
 * Decorator function to store edit metadata field mapping
 *
 * @param type The edit metadata field type
 * @param context The optional context the component represents
 * @param theme The optional theme for the component
 */
export function editMetadataValueFieldComponent(type: EditMetadataValueFieldType, context: Context = DEFAULT_CONTEXT, theme = DEFAULT_THEME) {
  return function decorator(component: any) {
    if (hasNoValue(map.get(type))) {
      map.set(type, new Map());
    }
    if (hasNoValue(map.get(type).get(context))) {
      map.get(type).set(context, new Map());
    }
    map.get(type).get(context).set(theme, component);
  };
}

/**
 * Getter to retrieve a matching component by entity type, metadata representation and context
 *
 * @param type The edit metadata field type
 * @param context The context to match
 * @param theme the theme to match
 */
export function getDsoEditMetadataValueFieldComponent(type: EditMetadataValueFieldType, context: Context = DEFAULT_CONTEXT, theme = DEFAULT_THEME) {
  if (type) {
    const mapForEntity = map.get(type);
    if (hasValue(mapForEntity)) {
      const contextMap = mapForEntity.get(context);
      if (hasValue(contextMap)) {
        const match = resolveTheme(contextMap, theme);
        if (hasValue(match)) {
          return match;
        }
        if (hasValue(contextMap.get(DEFAULT_THEME))) {
          return contextMap.get(DEFAULT_THEME);
        }
      }
      if (hasValue(mapForEntity.get(DEFAULT_CONTEXT)) && hasValue(mapForEntity.get(DEFAULT_CONTEXT).get(DEFAULT_THEME))) {
        return mapForEntity.get(DEFAULT_CONTEXT).get(DEFAULT_THEME);
      }
    }
  }
  return map.get(DEFAULT_EDIT_METADATA_FIELD_TYPE).get(DEFAULT_CONTEXT).get(DEFAULT_THEME);
}
