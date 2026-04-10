import { InjectionToken } from '@angular/core';

import { Context } from '../../core/shared/context.model';
import { GenericConstructor } from '../../core/shared/generic-constructor';
import { MetadataRepresentationType } from '../../core/shared/metadata-representation/metadata-representation.model';
import { OrgUnitItemMetadataListElementComponent } from '../../entity-groups/research-entities/metadata-representations/org-unit/org-unit-item-metadata-list-element.component';
import { PersonItemMetadataListElementComponent } from '../../entity-groups/research-entities/metadata-representations/person/person-item-metadata-list-element.component';
import { ProjectItemMetadataListElementComponent } from '../../entity-groups/research-entities/metadata-representations/project/project-item-metadata-list-element.component';
import {
  hasNoValue,
  hasValue,
} from '../empty.util';
import {
  DEFAULT_CONTEXT,
  DEFAULT_THEME,
  resolveTheme,
} from '../object-collection/shared/listable-object/listable-object.decorator';
import { BrowseLinkMetadataListElementComponent } from '../object-list/metadata-representation-list-element/browse-link/browse-link-metadata-list-element.component';
import { ItemMetadataListElementComponent } from '../object-list/metadata-representation-list-element/item/item-metadata-list-element.component';
import { PlainTextMetadataListElementComponent } from '../object-list/metadata-representation-list-element/plain-text/plain-text-metadata-list-element.component';

export const METADATA_REPRESENTATION_COMPONENT_FACTORY = new InjectionToken<(entityType: string, mdRepresentationType: MetadataRepresentationType, context: Context, theme: string) => GenericConstructor<any>>('getMetadataRepresentationComponent', {
  providedIn: 'root',
  factory: () => getMetadataRepresentationComponent,
});


export const DEFAULT_ENTITY_TYPE = 'Publication';
export const DEFAULT_REPRESENTATION_TYPE = MetadataRepresentationType.PlainText;

export type MetadataRepresentationComponent =
  typeof BrowseLinkMetadataListElementComponent |
  typeof PlainTextMetadataListElementComponent |
  typeof ItemMetadataListElementComponent |
  typeof OrgUnitItemMetadataListElementComponent |
  typeof PersonItemMetadataListElementComponent |
  typeof ProjectItemMetadataListElementComponent;

export const METADATA_REPRESENTATION_COMPONENT_DECORATOR_MAP =
  new Map<string, Map<MetadataRepresentationType, Map<Context, Map<string, MetadataRepresentationComponent>>>>([
    ['Publication', new Map([
      [MetadataRepresentationType.PlainText, new Map([
        [DEFAULT_CONTEXT, new Map([[DEFAULT_THEME, PlainTextMetadataListElementComponent as any]])]])],
      [MetadataRepresentationType.AuthorityControlled, new Map([
        [DEFAULT_CONTEXT, new Map([[DEFAULT_THEME, PlainTextMetadataListElementComponent]])]])],
      [MetadataRepresentationType.BrowseLink, new Map([
        [DEFAULT_CONTEXT, new Map([[DEFAULT_THEME, BrowseLinkMetadataListElementComponent]])]])],
      [MetadataRepresentationType.Item, new Map([
        [DEFAULT_CONTEXT, new Map([[DEFAULT_THEME, ItemMetadataListElementComponent]])]])],
    ])],
    ['Person', new Map([
      [MetadataRepresentationType.Item, new Map([
        [DEFAULT_CONTEXT, new Map([[DEFAULT_THEME, PersonItemMetadataListElementComponent]])]])],
    ])],
    ['OrgUnit', new Map([
      [MetadataRepresentationType.Item, new Map([
        [DEFAULT_CONTEXT, new Map([[DEFAULT_THEME, OrgUnitItemMetadataListElementComponent]])]])],
    ])],
    ['Project', new Map([
      [MetadataRepresentationType.Item, new Map([
        [DEFAULT_CONTEXT, new Map([[DEFAULT_THEME, ProjectItemMetadataListElementComponent]])]])],
    ])],
  ]);
/**
 * Decorator function to store metadata representation mapping
 * @param entityType The entity type the component represents
 * @param mdRepresentationType The metadata representation type the component represents
 * @param context The optional context the component represents
 * @param theme The optional theme for the component
 * @deprecated
 */
export function metadataRepresentationComponent(entityType: string, mdRepresentationType: MetadataRepresentationType, context: Context = DEFAULT_CONTEXT, theme = DEFAULT_THEME) {
  return function decorator(component: any) {
    if (hasNoValue(METADATA_REPRESENTATION_COMPONENT_DECORATOR_MAP.get(entityType))) {
      METADATA_REPRESENTATION_COMPONENT_DECORATOR_MAP.set(entityType, new Map());
    }
    if (hasNoValue(METADATA_REPRESENTATION_COMPONENT_DECORATOR_MAP.get(entityType).get(mdRepresentationType))) {
      METADATA_REPRESENTATION_COMPONENT_DECORATOR_MAP.get(entityType).set(mdRepresentationType, new Map());
    }

    if (hasNoValue(METADATA_REPRESENTATION_COMPONENT_DECORATOR_MAP.get(entityType).get(mdRepresentationType).get(context))) {
      METADATA_REPRESENTATION_COMPONENT_DECORATOR_MAP.get(entityType).get(mdRepresentationType).set(context, new Map());
    }

    if (hasValue(METADATA_REPRESENTATION_COMPONENT_DECORATOR_MAP.get(entityType).get(mdRepresentationType).get(context).get(theme))) {
      throw new Error(`There can't be more than one component to render Entity of type "${entityType}" in MetadataRepresentation "${mdRepresentationType}" with context "${context}"`);
    }
    METADATA_REPRESENTATION_COMPONENT_DECORATOR_MAP.get(entityType).get(mdRepresentationType).get(context).set(theme, component);
  };
}

/**
 * Getter to retrieve a matching component by entity type, metadata representation and context
 * @param entityType The entity type to match
 * @param mdRepresentationType The metadata representation to match
 * @param context The context to match
 * @param theme the theme to match
 */
export function getMetadataRepresentationComponent(entityType: string, mdRepresentationType: MetadataRepresentationType, context: Context = DEFAULT_CONTEXT, theme = DEFAULT_THEME) {
  const mapForEntity = METADATA_REPRESENTATION_COMPONENT_DECORATOR_MAP.get(entityType);
  if (hasValue(mapForEntity)) {
    const entityAndMDRepMap = mapForEntity.get(mdRepresentationType);
    if (hasValue(entityAndMDRepMap)) {
      const contextMap = entityAndMDRepMap.get(context);
      if (hasValue(contextMap)) {
        const match = resolveTheme(contextMap, theme);
        if (hasValue(match)) {
          return match;
        }
        if (hasValue(contextMap.get(DEFAULT_THEME))) {
          return contextMap.get(DEFAULT_THEME);
        }
      }
      if (hasValue(entityAndMDRepMap.get(DEFAULT_CONTEXT)) &&
        hasValue(entityAndMDRepMap.get(DEFAULT_CONTEXT).get(DEFAULT_THEME))) {
        return entityAndMDRepMap.get(DEFAULT_CONTEXT).get(DEFAULT_THEME);
      }
    }
    if (hasValue(mapForEntity.get(DEFAULT_REPRESENTATION_TYPE)) &&
      hasValue(mapForEntity.get(DEFAULT_REPRESENTATION_TYPE).get(DEFAULT_CONTEXT)) &&
      hasValue(mapForEntity.get(DEFAULT_REPRESENTATION_TYPE).get(DEFAULT_CONTEXT).get(DEFAULT_THEME))) {
      return mapForEntity.get(DEFAULT_REPRESENTATION_TYPE).get(DEFAULT_CONTEXT).get(DEFAULT_THEME);
    }
  }
  return METADATA_REPRESENTATION_COMPONENT_DECORATOR_MAP.get(DEFAULT_ENTITY_TYPE).get(DEFAULT_REPRESENTATION_TYPE).get(DEFAULT_CONTEXT).get(DEFAULT_THEME);
}
