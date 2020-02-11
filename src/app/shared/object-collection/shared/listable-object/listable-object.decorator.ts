import { ViewMode } from '../../../../core/shared/view-mode.model';
import { Context } from '../../../../core/shared/context.model';
import { hasNoValue, hasValue } from '../../../empty.util';
import { DEFAULT_CONTEXT } from '../../../metadata-representation/metadata-representation.decorator';
import { GenericConstructor } from '../../../../core/shared/generic-constructor';
import { ListableObject } from '../listable-object.model';

export const DEFAULT_VIEW_MODE = ViewMode.ListElement;

const map = new Map();

/**
 * Decorator used for rendering a listable object
 * @param objectType The object type or entity type the component represents
 * @param viewMode The view mode the component represents
 * @param context The optional context the component represents
 */
export function listableObjectComponent(objectType: string | GenericConstructor<ListableObject>, viewMode: ViewMode, context: Context = DEFAULT_CONTEXT) {
  const normalizedObjectType = (typeof objectType === 'string') ? objectType.toLowerCase() : objectType;
  return function decorator(component: any) {
    if (hasNoValue(normalizedObjectType)) {
      return;
    }
    if (hasNoValue(map.get(normalizedObjectType))) {
      map.set(normalizedObjectType, new Map());
    }
    if (hasNoValue(map.get(normalizedObjectType).get(viewMode))) {
      map.get(normalizedObjectType).set(viewMode, new Map());
    }
    map.get(normalizedObjectType).get(viewMode).set(context, component);
  };
}

/**
 * Getter to retrieve the matching listable object component
 * @param types The types of which one should match the listable component
 * @param viewMode The view mode that should match the components
 * @param context The context that should match the components
 */
export function getListableObjectComponent(types: Array<string | GenericConstructor<ListableObject>>, viewMode: ViewMode, context: Context = DEFAULT_CONTEXT) {
  let bestMatch;
  let bestMatchValue = 0;
  for (const type of types) {
    const normalizedType = (typeof type === 'string') ? type.toLowerCase() : type;
    const typeMap = map.get(normalizedType);
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
