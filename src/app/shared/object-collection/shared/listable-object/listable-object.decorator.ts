import { ViewMode } from '../../../../core/shared/view-mode.model';
import { Context } from '../../../../core/shared/context.model';
import { hasNoValue, hasValue } from '../../../empty.util';
import {
  DEFAULT_CONTEXT,
  DEFAULT_THEME
} from '../../../metadata-representation/metadata-representation.decorator';
import { GenericConstructor } from '../../../../core/shared/generic-constructor';
import { ListableObject } from '../listable-object.model';

export const DEFAULT_VIEW_MODE = ViewMode.ListElement;

const map = new Map();

/**
 * Decorator used for rendering a listable object
 * @param objectType The object type or entity type the component represents
 * @param viewMode The view mode the component represents
 * @param context The optional context the component represents
 * @param theme The optional theme for the component
 */
export function listableObjectComponent(objectType: string | GenericConstructor<ListableObject>, viewMode: ViewMode, context: Context = DEFAULT_CONTEXT, theme = DEFAULT_THEME) {
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
    if (hasNoValue(map.get(normalizedObjectType).get(viewMode).get(context))) {
      map.get(normalizedObjectType).get(viewMode).set(context, new Map());
    }
    map.get(normalizedObjectType).get(viewMode).get(context).set(theme, component);
  };
}

/**
 * Getter to retrieve the matching listable object component
 * @param types The types of which one should match the listable component
 * @param viewMode The view mode that should match the components
 * @param context The context that should match the components
 * @param theme The theme that should match the components
 */
export function getListableObjectComponent(types: (string | GenericConstructor<ListableObject>)[], viewMode: ViewMode, context: Context = DEFAULT_CONTEXT, theme: string = DEFAULT_THEME) {
  let bestMatch;
  let bestMatchValue = 0;
  for (const type of types) {
    const normalizedType = (typeof type === 'string') ? type.toLowerCase() : type;
    const typeMap = map.get(normalizedType);
    if (hasValue(typeMap)) {
      const typeModeMap = typeMap.get(viewMode);
      if (hasValue(typeModeMap)) {
        const contextMap = typeModeMap.get(context);
        if (hasValue(contextMap)) {
          if (hasValue(contextMap.get(theme))) {
            return contextMap.get(theme);
          }
          if (bestMatchValue < 3 && hasValue(contextMap.get(DEFAULT_THEME))) {
            bestMatchValue = 3;
            bestMatch = contextMap.get(DEFAULT_THEME);
          }
        }
        if (bestMatchValue < 2 &&
          hasValue(typeModeMap.get(DEFAULT_CONTEXT)) &&
          hasValue(typeModeMap.get(DEFAULT_CONTEXT).get(DEFAULT_THEME))) {
          bestMatchValue = 2;
          bestMatch = typeModeMap.get(DEFAULT_CONTEXT).get(DEFAULT_THEME);
        }
      }
      if (bestMatchValue < 1 &&
        hasValue(typeMap.get(DEFAULT_VIEW_MODE)) &&
        hasValue(typeMap.get(DEFAULT_VIEW_MODE).get(DEFAULT_CONTEXT)) &&
        hasValue(typeMap.get(DEFAULT_VIEW_MODE).get(DEFAULT_CONTEXT).get(DEFAULT_THEME))) {
        bestMatchValue = 1;
        bestMatch = typeMap.get(DEFAULT_VIEW_MODE).get(DEFAULT_CONTEXT).get(DEFAULT_THEME);
      }
    }
  }
  return bestMatch;
}
