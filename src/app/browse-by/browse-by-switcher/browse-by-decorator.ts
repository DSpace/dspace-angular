import { hasNoValue } from '../../shared/empty.util';
import { InjectionToken } from '@angular/core';
import { DEFAULT_THEME, resolveTheme } from '../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { AbstractBrowseByTypeComponent } from '../abstract-browse-by-type.component';
import { Context } from '../../core/shared/context.model';
import { GenericConstructor } from '../../core/shared/generic-constructor';

export enum BrowseByDataType {
  Title = 'title',
  Metadata = 'text',
  Date = 'date',
  Hierarchy = 'hierarchy',
}

export const DEFAULT_BROWSE_BY_TYPE = BrowseByDataType.Metadata;
export const DEFAULT_BROWSE_BY_CONTEXT = Context.Any;

export const BROWSE_BY_COMPONENT_FACTORY = new InjectionToken<(browseByType: BrowseByDataType, context: Context, theme: string) => GenericConstructor<AbstractBrowseByTypeComponent>>('getComponentByBrowseByType', {
  providedIn: 'root',
  factory: () => getComponentByBrowseByType
});

const map: Map<BrowseByDataType, Map<Context, Map<string, GenericConstructor<AbstractBrowseByTypeComponent>>>> = new Map();

/**
 * Decorator used for rendering Browse-By pages by type
 * @param browseByType  The type of page
 * @param context The optional context for the component
 * @param theme The optional theme for the component
 */
export function rendersBrowseBy(browseByType: BrowseByDataType, context = DEFAULT_BROWSE_BY_CONTEXT, theme = DEFAULT_THEME) {
  return function decorator(component: any) {
    if (hasNoValue(browseByType)) {
      return;
    }
    if (hasNoValue(map.get(browseByType))) {
      map.set(browseByType, new Map());
    }
    if (hasNoValue(map.get(browseByType).get(context))) {
      map.get(browseByType).set(context, new Map());
    }
    if (hasNoValue(map.get(browseByType).get(context).get(theme))) {
      map.get(browseByType).get(context).set(theme, component);
    } else {
      throw new Error(`There can't be more than one component to render Browse-By of type "${browseByType}", context "${context}" and theme "${theme}"`);
    }
  };
}

/**
 * Get the component used for rendering a Browse-By page by type
 * @param browseByType  The type of page
 * @param context The context to match
 * @param theme the theme to match
 */
export function getComponentByBrowseByType(browseByType: BrowseByDataType, context: Context, theme: string): GenericConstructor<AbstractBrowseByTypeComponent> {
  let contextMap: Map<Context, Map<string, GenericConstructor<AbstractBrowseByTypeComponent>>> = map.get(browseByType);
  if (hasNoValue(contextMap)) {
    contextMap = map.get(DEFAULT_BROWSE_BY_TYPE);
  }
  let themeMap: Map<string, GenericConstructor<AbstractBrowseByTypeComponent>> = contextMap.get(context);
  if (hasNoValue(themeMap)) {
    themeMap = contextMap.get(DEFAULT_BROWSE_BY_CONTEXT);
  }
  const comp = resolveTheme(themeMap, theme);
  if (hasNoValue(comp)) {
    return themeMap.get(DEFAULT_THEME);
  }
  return comp;
}
