import { MetadataRepresentationType } from '../../core/shared/metadata-representation/metadata-representation.model';
import { hasNoValue, hasValue } from '../empty.util';
import { Context } from '../../core/shared/context.model';
import { Item } from '../../core/shared/item.model';

const map = new Map();

export const DEFAULT_REPRESENTATION_TYPE = MetadataRepresentationType.PlainText;
export const DEFAULT_CONTEXT = Context.Undefined;

export function metadataRepresentationComponent(entityType: string, mdRepresentationType: MetadataRepresentationType, context: Context = DEFAULT_CONTEXT) {
  return function decorator(component: any) {
    if (hasNoValue(map.get(entityType))) {
      map.set(entityType, new Map());
    }

    if (hasNoValue(map.get(entityType).get(mdRepresentationType))) {
      map.get(entityType).set(mdRepresentationType, new Map());
    }

    if (hasValue(map.get(entityType).get(mdRepresentationType).get(context))) {
      throw new Error(`There can't be more than one component to render Entity of type "${entityType}" in MetadataRepresentation "${mdRepresentationType}" with context "${context}"`);
    }
    map.get(entityType).get(mdRepresentationType).set(context, component);
  }
}

export function getMetadataRepresentationComponent(entityType: string, mdRepresentationType: MetadataRepresentationType, context: Context = DEFAULT_CONTEXT) {
  const mapForEntity = map.get(entityType);
  if (hasValue(mapForEntity)) {
    const entityAndMDRepMap = mapForEntity.get(mdRepresentationType);
    if (hasValue(entityAndMDRepMap)) {
      if (hasValue(entityAndMDRepMap.get(context))) {
        return entityAndMDRepMap.get(context);
      }
      if (hasValue(entityAndMDRepMap.get(DEFAULT_CONTEXT))) {
        return entityAndMDRepMap.get(DEFAULT_CONTEXT);
      }
    }
    return mapForEntity.get(DEFAULT_REPRESENTATION_TYPE).get(DEFAULT_CONTEXT);
  }
  return map.get(Item.name).get(DEFAULT_REPRESENTATION_TYPE).get(DEFAULT_CONTEXT);
}