import { Component } from '@angular/core';

import { EDIT_METADATA_VALUE_FIELD_COMPONENT_MAP } from '../../../../../decorator-registries/edit-metadata-value-field-component-registry';
import { Context } from '../../../../core/shared/context.model';
import { GenericConstructor } from '../../../../core/shared/generic-constructor';
import { hasValue } from '../../../../shared/empty.util';
import {
  DEFAULT_THEME,
  getMatch,
} from '../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { EditMetadataValueFieldType } from '../dso-edit-metadata-field-type.enum';

export const DEFAULT_EDIT_METADATA_FIELD_TYPE = EditMetadataValueFieldType.PLAIN_TEXT;
export const DEFAULT_EDIT_METADATA_FIELD_CONTEXT = Context.Any;

/**
 * Decorator function to store edit metadata field mapping
 *
 * @param type The edit metadata field type
 * @param context The optional context the component represents
 * @param theme The optional theme for the component
 */
export function editMetadataValueFieldComponent(type: EditMetadataValueFieldType, context: Context = DEFAULT_EDIT_METADATA_FIELD_CONTEXT, theme = DEFAULT_THEME) {
  return function decorator(component: any) {
  };
}

/**
 * Getter to retrieve a matching component by entity type, metadata representation and context
 *
 * @param type The edit metadata field type
 * @param context The context to match
 * @param theme the theme to match
 * @param registry The registry containing all the components
 */
export function getDsoEditMetadataValueFieldComponent(type: EditMetadataValueFieldType, context: Context, theme: string, registry = EDIT_METADATA_VALUE_FIELD_COMPONENT_MAP): Promise<GenericConstructor<Component>> {
  const match = getMatch(registry, [type, context, theme], [DEFAULT_EDIT_METADATA_FIELD_TYPE, DEFAULT_EDIT_METADATA_FIELD_CONTEXT, DEFAULT_THEME]);
  return hasValue(match) ? match.match() : undefined;
}
