import { ViewMode } from '../../../../core/shared/view-mode.model';
import { Context } from '../../../../core/shared/context.model';
import { hasNoValue, hasValue } from '../../../empty.util';
import { DEFAULT_CONTEXT } from '../../../metadata-representation/metadata-representation.decorator';
import { GenericConstructor } from '../../../../core/shared/generic-constructor';
import { ListableObject } from '../listable-object.model';

export const DEFAULT_VIEW_MODE = ViewMode.ListElement;

const map = new Map();

/**
 * Decorator used for rendering simple item pages by type and viewMode (and optionally a representationType)
 * @param type
 * @param viewMode
 */
export function listableObjectComponent(objectType: string | GenericConstructor<ListableObject>, viewMode: ViewMode, context: Context = DEFAULT_CONTEXT) {
  return function decorator(component: any) {
    if (hasNoValue(objectType)) {
      return;
    }
    if (hasNoValue(map.get(objectType))) {
      map.set(objectType, new Map());
    }
    if (hasNoValue(map.get(objectType).get(viewMode))) {
      map.get(objectType).set(viewMode, new Map());
    }
    map.get(objectType).get(viewMode).set(context, component);
  };
}

export function getListableObjectComponent(types: Array<string | GenericConstructor<ListableObject>>, viewMode: ViewMode, context: Context = DEFAULT_CONTEXT) {
  let bestMatch;
  let bestMatchValue = 0;
  for (const type of types) {
    const typeMap = map.get(type);
    if (hasValue(typeMap)) {
      const typeModeMap = typeMap.get(viewMode);
      if (hasValue(typeModeMap)) {
        if (hasValue(typeModeMap.get(context))) {
          return typeModeMap.get(context);
        }
        if (bestMatchValue < 2 && hasValue(typeModeMap.get(DEFAULT_CONTEXT))) {
          bestMatchValue = 2;
          bestMatch = typeModeMap.get(DEFAULT_CONTEXT);
        }
      }
      if (bestMatchValue < 1 && hasValue(typeMap.get(DEFAULT_VIEW_MODE).get(DEFAULT_CONTEXT))) {
        bestMatchValue = 1;
        bestMatch = typeMap.get(DEFAULT_VIEW_MODE).get(DEFAULT_CONTEXT);
      }
    }
  }
  return bestMatch;
}
