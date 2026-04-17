import { Context } from '../../../../core/shared/context.model';
import { hasValue } from '../../../../shared/empty.util';
import {
  DEFAULT_CONTEXT,
  DEFAULT_THEME,
  resolveTheme,
} from '../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { DsoEditMetadataAuthorityFieldComponent } from '../dso-edit-metadata-authority-field/dso-edit-metadata-authority-field.component';
import { DsoEditMetadataEntityFieldComponent } from '../dso-edit-metadata-entity-field/dso-edit-metadata-entity-field.component';
import { EditMetadataValueFieldType } from '../dso-edit-metadata-field-type.enum';
import { DsoEditMetadataTextFieldComponent } from '../dso-edit-metadata-text-field/dso-edit-metadata-text-field.component';

export type MetadataValueFieldComponent =
  typeof DsoEditMetadataTextFieldComponent |
  typeof DsoEditMetadataEntityFieldComponent |
  typeof DsoEditMetadataAuthorityFieldComponent;

export const map = new Map<EditMetadataValueFieldType, Map<Context, Map<string, MetadataValueFieldComponent>>>([
  [EditMetadataValueFieldType.PLAIN_TEXT, new Map([
    [DEFAULT_CONTEXT, new Map([[DEFAULT_THEME, DsoEditMetadataTextFieldComponent]])],
  ])],
  [EditMetadataValueFieldType.ENTITY_TYPE, new Map([
    [DEFAULT_CONTEXT, new Map([[DEFAULT_THEME, DsoEditMetadataEntityFieldComponent]])],
  ])],
  [EditMetadataValueFieldType.AUTHORITY, new Map([
    [DEFAULT_CONTEXT, new Map([[DEFAULT_THEME, DsoEditMetadataAuthorityFieldComponent]])],
  ])],
]);

export const DEFAULT_EDIT_METADATA_FIELD_TYPE = EditMetadataValueFieldType.PLAIN_TEXT;

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
