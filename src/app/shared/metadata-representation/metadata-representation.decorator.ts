import { InjectionToken } from '@angular/core';

import { METADATA_REPRESENTATION_COMPONENT_MAP } from '../../../decorator-registries/metadata-representation-component-registry';
import { Context } from '../../core/shared/context.model';
import { GenericConstructor } from '../../core/shared/generic-constructor';
import { MetadataRepresentationType } from '../../core/shared/metadata-representation/metadata-representation.model';
import { hasValue } from '../empty.util';
import {
  DEFAULT_CONTEXT,
  DEFAULT_THEME,
  getMatch,
} from '../object-collection/shared/listable-object/listable-object.decorator';

export const METADATA_REPRESENTATION_COMPONENT_FACTORY = new InjectionToken<(entityType: string, mdRepresentationType: MetadataRepresentationType, context: Context, theme: string) => Promise<GenericConstructor<any>>>('getMetadataRepresentationComponent', {
  providedIn: 'root',
  factory: () => getMetadataRepresentationComponent,
});


export const DEFAULT_ENTITY_TYPE = 'Publication';
export const DEFAULT_REPRESENTATION_TYPE = MetadataRepresentationType.PlainText;


/**
 * Decorator function to store metadata representation mapping
 * @param entityType The entity type the component represents
 * @param mdRepresentationType The metadata representation type the component represents
 * @param context The optional context the component represents
 * @param theme The optional theme for the component
 */
export function metadataRepresentationComponent(entityType: string, mdRepresentationType: MetadataRepresentationType, context: Context = DEFAULT_CONTEXT, theme = DEFAULT_THEME) {
  return function decorator(component: any) {
  };
}

/**
 * Getter to retrieve a matching component by entity type, metadata representation and context
 * @param entityType The entity type to match
 * @param mdRepresentationType The metadata representation to match
 * @param context The context to match
 * @param theme the theme to match
 * @param registry The registry to search through. Defaults to METADATA_REPRESENTATION_COMPONENT_MAP, but other components can override this.
 */
export function getMetadataRepresentationComponent(entityType: string, mdRepresentationType: MetadataRepresentationType, context: Context, theme: string, registry = METADATA_REPRESENTATION_COMPONENT_MAP) {
  const match = getMatch(registry, [entityType, mdRepresentationType, context, theme], [DEFAULT_ENTITY_TYPE, DEFAULT_REPRESENTATION_TYPE, DEFAULT_CONTEXT, DEFAULT_THEME]);
  return hasValue(match) ? match.match() : undefined;
}
