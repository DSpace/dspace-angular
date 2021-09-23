import { ViewMode } from '../../../../core/shared/view-mode.model';
import { Context } from '../../../../core/shared/context.model';
import { hasNoValue, hasValue, isNotEmpty } from '../../../empty.util';
import { GenericConstructor } from '../../../../core/shared/generic-constructor';
import { ListableObject } from '../listable-object.model';
import { environment } from '../../../../../environments/environment';
import { ThemeConfig } from '../../../../../config/theme.model';
import { InjectionToken } from '@angular/core';

export const DEFAULT_VIEW_MODE = ViewMode.ListElement;
export const DEFAULT_CONTEXT = Context.Any;
export const DEFAULT_THEME = '*';

/**
 * Factory to allow us to inject getThemeConfigFor so we can mock it in tests
 */
export const GET_THEME_CONFIG_FOR_FACTORY = new InjectionToken<(str) => ThemeConfig>('getThemeConfigFor', {
  providedIn: 'root',
  factory: () => getThemeConfigFor
});

const map = new Map();

/**
 * Decorator used for rendering a listable object
 * @param objectType The object type or entity type the component represents
 * @param viewMode The view mode the component represents
 * @param context The optional context the component represents
 * @param theme The optional theme for the component
 */
export function listableObjectComponent(objectType: string | GenericConstructor<ListableObject>, viewMode: ViewMode, context: Context = DEFAULT_CONTEXT, theme = DEFAULT_THEME) {
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
    if (hasNoValue(map.get(objectType).get(viewMode).get(context))) {
      map.get(objectType).get(viewMode).set(context, new Map());
    }
    map.get(objectType).get(viewMode).get(context).set(theme, component);
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
    const typeMap = map.get(type);
    if (hasValue(typeMap)) {
      const typeModeMap = typeMap.get(viewMode);
      if (hasValue(typeModeMap)) {
        const contextMap = typeModeMap.get(context);
        if (hasValue(contextMap)) {
          const match = resolveTheme(contextMap, theme);
          if (hasValue(match)) {
            return match;
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

/**
 * Searches for a ThemeConfig by its name;
 */
export const getThemeConfigFor = (themeName: string): ThemeConfig => {
  return environment.themes.find(theme => theme.name === themeName);
};

/**
 * Find a match in the given map for the given theme name, taking theme extension into account
 *
 * @param contextMap A map of theme names to components
 * @param themeName The name of the theme to check
 * @param checkedThemeNames The list of theme names that are already checked
 */
export const resolveTheme = (contextMap: Map<any, any>, themeName: string, checkedThemeNames: string[] = []): any => {
  const match = contextMap.get(themeName);
  if (hasValue(match)) {
    return match;
  } else {
    const cfg = getThemeConfigFor(themeName);
    if (hasValue(cfg) && isNotEmpty(cfg.extends)) {
      const nextTheme = cfg.extends;
      const nextCheckedThemeNames = [...checkedThemeNames, themeName];
      if (checkedThemeNames.includes(nextTheme)) {
        throw new Error('Theme extension cycle detected: ' + [...nextCheckedThemeNames, nextTheme].join(' -> '));
      } else {
        return resolveTheme(contextMap, nextTheme, nextCheckedThemeNames);
      }
    }
  }
};
