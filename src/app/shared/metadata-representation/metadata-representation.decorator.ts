import { MetadataRepresentationType } from '../../core/shared/metadata-representation/metadata-representation.model';
import { hasNoValue, hasValue } from '../empty.util';
import { Context } from '../../core/shared/context.model';
import { DEFAULT_ITEM_TYPE } from '../items/item-type-decorator';

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
  if (hasNoValue(entityType) || hasNoValue(map.get(entityType))) {
    entityType = DEFAULT_ITEM_TYPE;
  }

  if (hasNoValue(map.get(entityType).get(mdRepresentationType))) {
    mdRepresentationType = DEFAULT_REPRESENTATION_TYPE;
  }

  let representationComponent = map.get(entityType).get(mdRepresentationType).get(context);

  if (hasNoValue(representationComponent)) {
    representationComponent = map.get(entityType).get(mdRepresentationType).get(DEFAULT_REPRESENTATION_TYPE);
  }

  return representationComponent;
}